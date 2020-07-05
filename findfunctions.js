const fs = require("fs");
const util = require("util");
const path = require("path");

const readdirP = util.promisify(fs.readdir);
const readFileP = util.promisify(fs.readFile);

const readFiles = async (foldername, result = []) => {
    try {
        const resval = await readdirP(path.join(__dirname, foldername));
        return resval.reduce(async (accum, value) => {
            if (value.indexOf(".") !== -1) {
                return await accum.concat([`${foldername}/${value}`]);
            } else {
                return await readFiles(`${foldername}/${value}`, await accum);
            }
        }, result);
    } catch (error) {
        throw new Error(error);
    }
};

const readFunctions = async filename => {
    try {
        const regex = /function ([\w-]*)\(/g;
        const file = await readFileP(filename, "utf8");
        const match = (count = 0, result = []) => {
            const sliced = file.slice(count);
            const index = sliced.search(regex);
            if (index !== -1) {
                const fns = regex.exec(sliced);
                if (fns === null) return result;
                return match(index + 3, result.concat(fns[1]));
            } else return result;
        };
        return {
            file: filename,
            functions: match()
        };
    } catch (error) {
        throw new Error(error);
    }
};

readFiles("test")
    .then(data => Promise.all(data.map(readFunctions)))
    .then(data => console.log(data))
    .catch(err => console.log(err));
