<script>
import Animator from "./animator";

export default {
    props: {
        tag: {
            type: String,
            default: "div",
        },

        options: {
            type: Object,
        },

        value: {
            type: [Number, String, Boolean],
            default: 0,
        },

        trigger: {
            type: Array,
        },

        hover: {
            type: Array,
        },

        auto: {
            type: Array,
        },

        click: {
            type: Array,
        },
    },

    render() {
        return this.$createElement(
            this.tag,
            {
                on: this.$listeners,
            },
            this.$slots.default
        );
    },

    data() {
        return {
            parameters: {
                hover: [],
                click: [],
                trigger: [],
                auto: [],

                instantRollback: false,
                rollback: true,
                repeat: false,
                factor: 0,
                delay: 0,
                stepDelay: 0,
                skip: 0,

                duration: 300,
                ease: "ease-in-out",
            },

            animators: [],
            activated: false,
        };
    },

    methods: {
        setup() {
            this.parameters = {
                ...this.parameters,
                ...this.options,
            };

            this.parameters = {
                ...this.parameters,
                trigger: this.trigger ? this.trigger : this.parameters.trigger,
                hover: this.hover ? this.hover : this.parameters.hover,
                click: this.click ? this.click : this.parameters.click,
                auto: this.auto ? this.auto : this.parameters.auto,
            };

            if (this.parameters.repeat && !this.options.rollback) {
                this.parameters.rollback = false;
            }

            this.addAnimationClasses();
            this.initAnimators();
        },

        initAnimators() {
            ["hover", "click", "trigger", "auto"].forEach((action) => {
                if (this.parameters[action].length) {
                    let animator = new Animator(
                        this.$el,
                        this.parameters,
                        this.value,
                        action
                    );

                    animator.setup();

                    this.animators.push(animator);
                }
            });
        },

        addAnimationClasses() {
            this.$el.classList.add("transition-all");
            this.$el.classList.add("transform");
            this.$el.classList.add(this.parameters.ease);
        },
    },

    mounted() {
        this.setup();
    },

    beforeDestroy() {
        this.animators.forEach((animator) => {
            animator.destroyListeners();
        });
    },

    watch: {
        value() {
            let animator = this.animators.filter(
                (animator) => animator.action == "trigger"
            )[0];

            if (animator) {
                setTimeout(() => {
                    if (!this.activated) {
                        animator.start(true);
                    } else {
                        animator.stop(true);
                    }

                    this.activated = !this.activated;
                }, this.parameters.delay);
            }
        },
    },
};
</script>