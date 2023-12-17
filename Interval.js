export class CompositionEquation {
    constructor(expression, result) {
        this.expression = expression
        this.result = result

        this.repeat = false
        let valuesSet = new Set()
        for(let key in this.expression) {
            valuesSet.add(this.expression[key])
        }

        this.repeat = Array.from(valuesSet).length !== Object.keys(this.expression).length
    }

    getSolutionsList() {
        let possibleFixedVars = Object.keys(this.expression).filter(varName => this.expression[varName] >= this.result)
        if(possibleFixedVars.length <= 0) {
            return []
        }

         let solutionsList = []

        for (let fixedVar of possibleFixedVars) {
            let solution = {};

            for (let varName in this.expression) {

                if (varName !== fixedVar) {
                    if(this.expression[varName] === this.result) {
                        solution[varName] = new Interval(
                            Math.max(
                                this.expression[varName],
                                this.result
                            ),
                            1.0
                        );
                    } else if(this.expression[varName] > this.result) {
                        solution[varName] = new Interval(this.result, this.result)
                    }
                    else {
                        solution[varName] = new Interval(
                           0,
                            1.0
                        );
                    }
                }
                else {
                    if(this.repeat) {
                        solution[varName] = new Interval(0, 1)
                    } else if(this.expression[varName] === this.result) {
                        solution[varName] = new Interval(this.expression[varName], 1.0)
                    } else {
                        solution[varName] = new Interval(this.result, this.result)
                    }
                }
            }

            solutionsList.push(solution);
        }
        return solutionsList
    }
}

export class Interval {
    constructor(left, right) {
        this.left = left;
        this.right = right
    }
}
