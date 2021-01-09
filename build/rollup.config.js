import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';

export default {
    input: 'src/index.js',
    output: {
        name: 'Motion',
        exports: 'named'
    },
    plugins: [
        commonjs(),
        vue({
            css: true,
            compileTemplate: true,
        }),
        buble({
            objectAssign: 'Object.assign'
        })
    ],
};