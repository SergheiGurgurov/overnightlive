const path = require("path");
const fs = require("fs");

const onionEssentials = import("onion-essentials")
/**
 * @param {string} pathToFile 
 * @param {(err:Error,result:string)=>{}} complete 
 */
function bundle(pathToFile, complete) {
    onionEssentials.then(({ parallel }) => {
        fs.readFile(pathToFile, (err, data) => {
            if (err) {
                complete(err, null)
                return;
            }

            let html = data.toString()
            const scripts = html.matchAll(/<script.*src="(?<filePath>.*)".*><\/script>/g)
            const links = html.matchAll(/<link.*href="(?<filePath>.*)".*>/g)
            parallel(($await, $) => {
                for (let match of scripts) {
                    $await(fs.readFile(path.join(pathToFile, "..", match.groups.filePath), (err, data) => {
                        if (err) {
                            throw err
                        }

                        html = html.replace(match[0], `<script>${data.toString()}</script>`)
                        $()
                    }));
                }

                for (let match of links) {
                    $await(fs.readFile(path.join(pathToFile, "..", match.groups.filePath), (err, data) => {
                        if (err) {
                            throw err
                        }

                        html = html.replace(match[0], `<style>${data.toString()}</style>`)
                        $()
                    }));
                }
            }, () => {
                complete(null, html)
            })
        })
    })
}

exports.bundle = bundle;

