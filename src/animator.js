const SINGLE_WORD_PROPERTIES = [
    'bg',
    'text',
    'border',
    'ring',
];

class Animator {
    constructor(el, options, trigger, action) {
        this.el = el;
        this.options = options;
        this.action = action;
        this.trigger = trigger;
        this.index = 0;
        this.timeline = [];
        this.runTimer = {};
        this.rollbackTimer = {};
        this.durations = [];
    }

    setup() {
        this.registerListeners();
        this.buildTimeline();

        this.timeline[0].forEach(className => {
            this.el.classList.add(className);
        });
    }

    registerListeners() {
        if (this.action === 'hover') {
            this.el.addEventListener('mouseenter', () => this.start(true))

            if (this.options.rollback) {
                this.el.addEventListener('mouseleave', () => this.stop(true))
            }
        }

        else if (this.action === 'click') {
            this.el.addEventListener('mousedown', () => this.start(true))

            if (this.options.rollback) {
                this.el.addEventListener('mouseup', () => this.stop(true))
            }
        }

        else if (this.action === 'auto') {
            this.start(true);
        }
    }

    destroyListeners() {
        this.el.removeEventListener('mouseenter', this.start)
        this.el.removeEventListener('mouseleave', this.stop)
        this.el.removeEventListener('mousedown', this.start)
        this.el.removeEventListener('mouseup', this.stop)
    }

    parseProperty(property) {
        let propertyParts = property.split("-");
        let propertyNameParts = [];
        let value;

        // bg-green-500 is a "single-word" property, while translate-x-3 is not
        if (SINGLE_WORD_PROPERTIES.includes(propertyParts[0]) && propertyParts.length == 3) {
            propertyNameParts = propertyParts.splice(
                0,
                1
            );

            value = propertyParts.join('-');
        }

        // property without a value part (rounded, shadow, border)
        else if (propertyParts.length == 1) {
            propertyNameParts = propertyParts;

            value = null;
        }

        // other properties (w-16, shadow-lg)
        else {
            propertyNameParts = propertyParts.splice(
                0,
                propertyParts.length - 1
            );

            value = propertyParts[propertyParts.length - 1];
        }

        let propertyName = propertyNameParts.join("-");

        // -translate-x-3 converts to a property translate-x with the value of -3
        if (propertyNameParts[0] == "") {
            propertyName = propertyNameParts
                .splice(1)
                .join("-");
            value = -value;
        }

        return [propertyName, value];
    }

    getUsedProperties(keyframes) {
        return keyframes.map((keyframe) => {
            return keyframe.split(" ").map((property) => {
                let [propertyName] = this.parseProperty(property);

                return propertyName;
            });
        })
            .flat(1)
            .filter((v, i, a) => a.indexOf(v) === i);
    }

    buildTimeline() {
        let properties = this.getUsedProperties(this.options[this.action]);
        let timeline = [];

        // build a list of properties with values
        this.options[this.action].forEach((keyframe, index) => {
            let classList = {};

            keyframe = keyframe.split(" ").map((property) => {
                let [propertyName, value] = this.parseProperty(property);
                let result = {};

                result[propertyName] = value;
                return result;
            });

            keyframe = Object.assign({}, ...keyframe);

            properties.forEach((propertyName) => {
                if (keyframe[propertyName] !== undefined) {
                    classList[propertyName] = keyframe[propertyName];
                } else if (index != 0 && propertyName != 'duration') {
                    classList[propertyName] = timeline[index - 1][propertyName];
                } else {
                    classList[propertyName] = null;
                }
            });

            if (!classList.duration) {
                classList.duration = this.options.duration;
            }

            timeline.push(classList);
        });

        // build a sequence of css classes
        timeline.forEach((timeframe) => {
            let classList = Object.entries(timeframe)
                .map(([propertyName, value]) => {
                    if (value == null) {
                        return propertyName;
                    }
                    else if (parseInt(value) === value && value < 0) {
                        return `-${propertyName}-${Math.abs(value)}`;
                    } else {
                        return `${propertyName}-${value}`;
                    }
                });

            if (timeframe.duration) {
                this.durations.push(timeframe.duration);
            }
            else {
                this.durations.push(this.options.duration);
            }

            this.timeline.push(classList);
        });
    }

    start(firstInteraction = false) {
        if (this.rollbackTimer) {
            clearTimeout(this.rollbackTimer);
        }

        let duration = firstInteraction ? 0 : this.durations[this.index];

        if (this.index == 0 && !firstInteraction && this.options.factor) {
            duration = this.options.duration * (this.options.factor - 1);
        }

        if (firstInteraction) {
            duration += this.options.skip * this.durations[this.index];
            duration += this.options.delay;
        }

        if (!firstInteraction && this.options.stepDelay) {
            duration += this.options.stepDelay;
        }

        this.runTimer = setTimeout(() => this.run(), duration);
    }

    run() {
        if (this.index == this.timeline.length - 1 && !this.options.repeat) {
            return;
        }

        this.timeline[this.index].forEach(className => {
            this.el.classList.remove(className);
        });

        if (this.index == this.timeline.length - 1 && this.options.repeat) {
            this.index = 0;
        }
        else {
            this.index++;
        }

        this.timeline[this.index].forEach(className => {
            this.el.classList.add(className);
        });

        this.start();
    }

    forceRollback() {
        return new Promise((resolve) => {
            while (this.index > 0) {
                this.timeline[this.index].forEach(className => {
                    this.el.classList.remove(className);
                });

                this.index--;
            }

            this.timeline[0].forEach(className => {
                this.el.classList.add(className);
            });

            resolve();
        });
    }

    stop(firstInteraction = false) {
        if (this.runTimer) {
            clearTimeout(this.runTimer);
        }

        if (!this.options.rollback) {
            return;
        }

        if (this.options.instantRollback) {
            return this.forceRollback();
        }

        let duration = firstInteraction ? 0 : this.durations[this.index];

        if (firstInteraction) {
            duration += this.options.skip * this.durations[this.index];
            duration += this.options.delay;
        }

        if (!firstInteraction && this.options.stepDelay) {
            duration += this.options.stepDelay;
        }

        this.rollbackTimer = setTimeout(() => this.rollback(), duration);
    }

    rollback() {
        if (this.index == 0) {
            return;
        }

        this.timeline[this.index].forEach(className => {
            this.el.classList.remove(className);
        });

        this.index--;

        this.timeline[this.index].forEach(className => {
            this.el.classList.add(className);
        });

        this.stop();
    }
}

export { Animator as default };