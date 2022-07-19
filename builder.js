const Helper = require('cli-helper').instance;
const DateTime = require('datetime-js');
const readdirGlob = require('readdir-glob');
const uglify = require('uglify-js');
const path = require('path');
const fs = require('fs');
const dir = __dirname;

const conf = JSON.parse(Helper.readFile(`${dir}/package.json`));

const date = DateTime(new Date(), '%Y-%m-%d');
// comment banner
const comment = `
/**
 * ${conf.name} {{varMode}} v${conf.version} | ${date}
 * ${conf.description}
 * by ${conf.author}
 */
`;

// clean
cleandir('js/**')
// cleandir('src/tmp/*.tmp')
//cleandir('**/*.js');
process.exit();

// copy:dist
copy('src/modulr.js', 'footest/modulr.js', (content) => {
    content = content.replace('{{version}}', conf.version);
    content = content.replace('//${returnValue}', 'return window.Modulr || app;');
    content = [comment.replace('{{varMode}}', ''), content].join('\n\n');
    return content;
})

// copy:privateScope
copy('src/modulr.js', 'footest/modulr.scope.js', (content) => {
    content = content.replace('${version}', conf.version);
    content = content.replace('//${returnValue}', 'return app;');
    content = [comment.replace('{{varMode}}', ' (private scope)'), content].join('\n\n');
    return content;
})

// copy:demo


async function cleandir(pattern) {
    const promise = new Promise((resolve, reject) => {
        const match = glob(pattern);
        console.log('matchin >>')
        match.on('match', (info) => {
            // if (Helper.isFileExists(info.absolute)) {
            //     fs.unlink(info.absolute, (err) => {
            //       if (err) throw err;
            //     });
            // }
            console.log('>>', info);
        });

        match.on('error', (err) => {
            console.log('err')
            reject();
        });

        match.on('end', () => {
            console.log('done')
            resolve();
        });
        console.log('')
    });

    promise(() => {
        console.log('yes')
    });
    console.log('here >>')

    const res = await promise;
    return res;
}

function minify(pattern) {

}

async function globcopy(source, dest, process) {
    const promise = new Promise((resolve, reject) => {
        if (Helper.isPathExists(source)) {
            const match = glob(pattern);

            match.on('match', (info) => {
                // if (Helper.isFileExists(info.absolute)) {
                //     fs.unlink(info.absolute, (err) => {
                //       if (err) throw err;
                //     });
                // }
                console.log(info);
            });

            match.on('error', (err) => {
                console.log('err')
                reject();
            });

            match.on('end', () => {
                resolve();
            });
        }
    })

    const res = await promise;
    return res;
}

async function copy(sourceFile, destFile, process) {
    const promise = new Promise((resolve, reject) => {

        if (Helper.isFileExists(sourceFile)) {
            let content = Helper.readFile(sourceFile);
            if (typeof process === 'function') {
                content = process(content);
            }
            let res = uglify.minify(content);

            let destDir = path.normalize([
                dir,
                destFile.replace(/\/(.+)\.(.+){2,4}$/i, '')
            ].join('/'));

            if (!Helper.isPathExists(destDir)) {
                Helper.createDir(destDir);
            }

            Helper.writeFile(destFile, content);
        } else {
            reject('file not found!');
        }
    });

    const res = await promise;
    return res;
}

function glob(pattern) {
    const match = readdirGlob(dir, {
        pattern: pattern
    });

    return match;
}
