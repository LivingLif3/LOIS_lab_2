import {ReadFile} from "./readFile.js";
// import {Parser} from "./parser.js"
import {Solver} from "./solver.js";
import {Parser} from "./parser2.js";

function logSet(set) {
    let string = `${set.name}={`, i = 0
    for(let el of set.logicalConclusion) {
        if(i !== set.logicalConclusion.length - 1) {
            string += `<${el[0]},${el[1]}>,`
        } else {
            string += `<${el[0]},${el[1]}>}`
        }
        i++
    }
    return string
}

function logRules(set) {
    let string = `${set.name}={`, i = 0
    let lengthOfRule = 0

    for(let rule of set.rule) {
        lengthOfRule += rule.length
    }

    for(let rule of set.rule) {
        for(let el of rule) {
            if(i !== lengthOfRule - 1) {
                string += `<<${el[0]}>,${el[1]}>,`
            } else {
                string += `<<${el[0]}>,${el[1]}>}`
            }
            i++
        }
    }
    return string
}

const main = () => {
    let fileData = new ReadFile('input.txt')
    let data = fileData.readFile()


    let parser = new Parser(data)

    let values = parser.startParser()


    for(let conclusion of values.logicalConclusions) {
        for(let rule of values.rules) {
            console.log('-------------------------------------------------')
            console.log(`Предикат задающий множество следствий: ${conclusion.name}`)
            console.log(logSet(conclusion))
            console.log(`Бинарный нечеткий предикат, задающий правило: ${rule.name}`)
            console.log(logRules(rule))
            let solution = new Solver(conclusion.logicalConclusion, rule.rule)
            solution.main()
            console.log('-------------------------------------------------')
        }
    }
}

main()
