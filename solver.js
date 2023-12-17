import {CompositionEquation, Interval} from "./Interval.js";

export class Solver {
    constructor(
        logicalConclusion,
        rules
    ) {
        this.logicalConclusion = logicalConclusion
        /*
        * logicalConclusion = [['y1', 0.7], ['y2', 0.3], ['y3', 0.2]]
        * */
        this.rules = rules
        /*
        * rules = [
        *           [[['x1','y1'], 0.7], [['x1','y2'], 0.1], [['x1','y3'], 0.2]],
        *           [[['x2','y1'], 0.7], [['x2','y2'], 0.3], [['x2','y3'], 0.1]]
        *          ]
        * */
        this.matrix = []
        this.answers = []
    }

    formMatrix() {
        // for(let i = 0; i < this.rules[0].length; i++) {
        //     let newRow = []
        //     for(let row of this.rules) {
        //         let variable = row[i][0][1]
        //         newRow.push(row[i])
        //     }
        // }
        for (let el of this.rules[0]) {
            let newRow = [el]
            let variable = el[0][1]
            for (let i = 1; i < this.rules.length; i++) {
                let findedElement = this.rules[i].find(el => el[0][1] === variable)
                newRow.push(findedElement)
            }
            this.matrix.push(newRow)
        }
    }

    formAnswers() { // [['y2', 0.7], ['y1', 0.7]]
        for(let row of this.matrix) {
            for(let el of row[0]) {
                if(typeof el === "number") continue
                let variable = el[1]
                let answer = this.logicalConclusion.find(el => el[0] === variable)
                this.answers.push(answer)
            }
        }
    }

    solve() {
        let maxes = Array(this.matrix[0].length).fill(0);
        for(let i = 0; i < this.matrix.length; i++) {
            for(let j = 0; j < this.matrix[i].length; j++) {
                if(this.matrix[i][j][1] > maxes[j]) {
                    maxes[j] = this.matrix[i][j][1]
                }
            }
        }
    }

    printAnswer(maxes) {
        let string
        for(let el of maxes) {

        }
    }

    transformDataToObj() {
        let expressions = []
        let answers = []
        for(let row of this.matrix) {
            let expression = {}
            for(let i = 0; i < row.length; i++) {
                expression[row[i][0][0]] = row[i][1]
            }
            expressions.push(expression)
        }
        for(let el of this.answers) {
            answers.push(el[1])
        }
        return {
            expressions,
            answers
        }
    }

    log(intersections) {
        let string = "<", index = 0
        for(let key in intersections[0]) {
            if(index !== Object.keys(intersections[0]).length - 1) {
                string += `C(${key}),`
            } else {
                string += `C(${key})`
            }
            index++
        }
        string += "> ∈ "
        let counter2 = 0
        for(let intersection of intersections) {
            string += "("
            let counter = 0
            for(let key in intersection) {
                if(counter !== Object.keys(intersection).length - 1) {
                    if(intersection[key].left === intersection[key].right) {
                        string += `${intersection[key].left}x`
                    } else {
                        string += `[${intersection[key].left},${intersection[key].right}]x`
                    }
                } else {
                    if(intersection[key].left === intersection[key].right) {
                        string += `${intersection[key].left}`
                    } else {
                        string += `[${intersection[key].left},${intersection[key].right}]`
                    }
                }
                counter++
            }
            string += ")"
            if(counter2 !== intersections.length - 1) {
                string += "U"
            }
            counter2++
        }
        console.log(string)
    }

    logSystem() {
        let string = ""
        for(let i = 0; i < this.matrix.length; i++) {
            let counter = 0
            for(let el of this.matrix[i]) {
                if(counter !== this.matrix[i].length - 1) {
                    string += `(${el[1]}/~\\C(${el[0][0]}))\\~/`
                } else {
                    string += `(${el[1]}/~\\C(${el[0][0]}))=`
                }
                counter++
            }
            string += `${this.answers[i][1]}\n`
        }
        return string
    }

    findIntersectionOfIntervals(intervals) {
        // console.log(intervals, "INTERVALS")
        // for(let interval of intervals) {
        //     console.log(interval)
        // }
        let countOfIntersections = 0, index = 0
        let intersections = []
        for(let i = 0; i < intervals.length; i++) {
            if(intervals[i].length > countOfIntersections) {
                countOfIntersections = intervals[i].length
                index = i
            }
        }

        for(let i = 0; i < countOfIntersections; i++) {
            let maxInterval = {...intervals[index][i]}
            for(let j = 0; j < intervals.length; j++) {
                if(index !== j) {
                    for(let interval of intervals[j]) {
                        for(let key in interval) {
                            if(interval[key].left > intervals[index][i][key].left) {
                                maxInterval[key].left = interval[key].left
                            }
                            if(interval[key].right < intervals[index][i][key].right) {
                                maxInterval[key].right = interval[key].right
                            }
                        }
                    }
                }
            }
            intersections.push(maxInterval)
        }
        return intersections
    }

    main() {
        this.formMatrix()
        this.formAnswers()


        let suitableData = this.transformDataToObj()

        console.log('Система:')
        console.log(this.logSystem())

        let intervals = []
        for(let i = 0; i < suitableData.expressions.length; i++) {
            let interval = new CompositionEquation(
                suitableData.expressions[i],
                suitableData.answers[i]
            )
            intervals.push(
                interval.getSolutionsList()
            )
        }
        for(let interval of intervals) {
            if(!interval.length) {
                console.log("∅")
                return
            }
        }
        console.log('Результат обратного вывода:')
        const intersections = this.findIntersectionOfIntervals(intervals)
        this.log(intersections)
    }
}

// let test = new Solver([['y1', 0.6], ['y2', 0.2], ['y3', 0.2]], [
//     [[['x1', 'y1'], 0.7], [['x1', 'y2'], 0.2], [['x1', 'y3'], 0.2]],
//     [[['x2', 'y1'], 0.5], [['x2', 'y2'], 0.1], [['x2', 'y3'], 0.1]]
// ])

/*
[['y1', 0.6], ['y2', 0.2], ['y3', 0.2]], [
    [[['x1', 'y1'], 0.7], [['x1', 'y2'], 0.1], [['x1', 'y3'], 0.1]],
    [[['x2', 'y1'], 0.5], [['x2', 'y2'], 0.1], [['x2', 'y3'], 0.1]]
]
*/

// test.main()
