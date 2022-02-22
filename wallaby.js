module.exports = function(wallaby) {
    return {
        files: [
            'tsconfig.json',
            { pattern: './test/test-setup.ts', instrument: false, load: false},
            { pattern: './test/utils/*.ts'},
            { pattern: '**/src/**/*.ts'},
            { pattern: '**/test/**/*-helpers.ts' },
        ],
        tests: [
            {pattern: '/**/test/**/*.spec.ts' },
        ],
        testFramework: 'mocha',
        env: { type: 'node', runner: 'node' },

        // setup: (wlb) => {
        //     require('./test-setup')
        // },
        bootstrap: () => {
            require('./test/test-setup.ts'); // <-- it's in the `files` list, so you may just do that
        },
        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
                target: 'es2019'
            })
        },
    }
}
