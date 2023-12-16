export class CompositionEquation {
    constructor(expression, result) {
        this.expression = expression
        this.result = result
    }

    get_solutions_list() {
        let possibleFixedVars = Object.keys(this.expression).filter(varName => this.expression[varName] >= this.result)
        if(possibleFixedVars.length <= 0) {
            return
        }

        let solutionsList = []

        for (let fixedVar of possibleFixedVars) {
            let solution = {};

            for (let varName in this.expression) {

                if (varName !== fixedVar) {
                    solution[varName] = new Interval(
                        Math.max(
                            this.expression[varName],
                            this.result
                        ),
                        1.0
                    );
                } else {
                    solution[varName] = new Interval(
                        0.0,
                        1.0
                    );
                }

                // if (varName !== fixedVar) {
                //     solution[varName] = new Interval(
                //         0,
                //         Math.min(
                //             1.0,
                //             this.expression[varName] === 0
                //                 ? 1.0
                //                 : this.result / this.expression[varName]
                //         )
                //     );
                // } else {
                //     solution[varName] = this.result / this.expression[varName];
                // }
            }

            solutionsList.push(solution);
        }
        console.log(solutionsList, 'fsafa')
        return solutionsList
    }
}

export class Interval {
    constructor(left, right) {
        this.left = left;
        this.right = right
    }
}
