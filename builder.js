const Helper = require('cli-helper').instance;
const DateTime = require('datetime-js');
const readdirGlob = require('readdir-glob');
const uglify = require('uglify-js');
const path = require('path');
const fs = require('fs');
const dir = __dirname;

const conf = JSON.parse(Helper.readFile(`${dir}/package.json`));
let iter = 0;
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
cleandir('footest/**')
    .then(() => {
        return cleandir('src/tmp/*.tmp');
    })
    .then(() => {
        // copy:dist
        return copy('src/modulr.js', 'footest/modulr.js', (content) => {
            content = content.replace('{{version}}', conf.version);
            content = content.replace('//${returnValue}', 'return window.Modulr || app;');
            content = [comment.replace('{{varMode}}', ''), content].join('\n\n');
            return content;
        })
    })
    .then(() => {
        // copy:privateScope
        return copy('src/modulr.js', 'footest/modulr.scope.js', (content) => {
            content = content.replace('${version}', conf.version);
            content = content.replace('//${returnValue}', 'return app;');
            content = [comment.replace('{{varMode}}', ' (private scope)'), content].join('\n\n');
            return content;
        })
    })
    .then(() => {
        // copy:demo
        return copy('js/modulr.js', 'demo/js/modulr.js');
    })

function cleandir(pattern) {
    return new Promise((resolve, reject) => {
        const match = glob(pattern);
        let arr = []
        match.on('match', (info) => {
            arr.push(info)
        });

        match.on('error', (err) => {
            console.log('err')
            reject();
        });

        match.on('end', () => {
            for (let i = 0; i < arr.length; i++) {
                let info = arr[i];
                console.log(info);
                if (Helper.isFileExists(info.absolute)) {
                    fs.unlinkSync(info.absolute);
                } else if (Helper.isPathExists(info.absolute)) {
                    fs.rmdirSync(info.absolute, { recursive: true });
                }
            }
            console.log('cleandir', pattern, ++iter)
            resolve();
        });
    });
}

function minify(pattern) {

}

function globcopy(source, dest, process) {
    return new Promise((resolve, reject) => {
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
        } else {
            resolve();
        }
    })
}

function copy(sourceFile, destFile, process) {
    return new Promise((resolve, reject) => {
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
            console.log('copy', sourceFile, ++iter)
            resolve();
        } else {
            reject('file not found!');
        }
    });
}

function glob(pattern) {
    const match = readdirGlob(dir, {
        pattern: pattern
    });

    return match;
}
