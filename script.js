function myFunction(key) {
	if (key == "C") {
		document.getElementById("console-container").value = "";
		document.getElementsByClassName("header")[0].innerHTML = "";

	} else if (key == "x" || key == "+" || key == "-" || key == "/") {
		document.getElementById("console-container").value += " " + key + " ";
	} else {
		document.getElementById("console-container").value += key;
	}
}

function tokenize(string) {
	var results=[];
	var tokenRegex= /\s*([A-Za-z]+|((\d+(\.\d*)?)|(\.\d+))|\S)\s*/g;
	var temp;
	while ((temp = tokenRegex.exec(string)) !== null) {
		results.push(temp[1]);
	}
	return results;
}

function isNumber(token) {
	return token !== undefined && token.match(/^((\d+(\.\d*)?)|(\.\d+))$/);
}


function parse(tokens) {
	var position = 0;

	function peek() { return tokens[position];}
	function consume(token) {
		position++;
	}

	function parsePrimaryExpr() {
        var t = peek();

        if (isNumber(t)) {
            consume(t);
            return {type: "number", value: t};
        } else if (t === "(") {
            consume(t);
            var expr = parseExpr();
            if (peek() !== ")") {
            	document.getElementsByClassName("header")[0].innerHTML = "Syntax Error: expected )";
                throw new SyntaxError("expected )");
            }
            consume(")");
            return expr;
        } else {
        	document.getElementsByClassName("header")[0].innerHTML = "Syntax Error: expected a number, or parentheses";
        	throw new SyntaxError("expected a number, or parentheses");
        }
    }

    function parseMulExpr() {
        var expr = parsePrimaryExpr();
        var t = peek();
        while (t === "*" || t === "/") {
            consume(t);
            var rhs = parsePrimaryExpr();
            expr = {type: t, left: expr, right: rhs};
            t = peek();
        }
        return expr;
    }

    function parseExpr() {
        var expr = parseMulExpr();
        var t = peek();
        while (t === "+" || t === "-") {
            consume(t);
            var rhs = parseMulExpr();
            expr = {type: t, left: expr, right: rhs};
            t = peek();
        }
        return expr;
    }

    var result = parseExpr();

    if (position !== tokens.length) {
    	document.getElementsByClassName("header")[0].innerHTML = "Syntax Error: unexpected " + peek() + "'";
    	throw new SyntaxError("unexpected '" + peek() + "'");
	}
    return result;

}

function evaluate(parsedStr) {
	if(parsedStr.type === "number") {
		return Number(parsedStr.value);
	}
	else if (typeof ParsedStr !== undefined) {
		if (parsedStr.type === "+") {
			return evaluate(parsedStr.left) + evaluate(parsedStr.right);
		}
		else if (parsedStr.type === "-") {
			return evaluate(parsedStr.left) - evaluate(parsedStr.right);
		}
		else if (parsedStr.type === "*") {
			return evaluate(parsedStr.left) * evaluate(parsedStr.right);
		}
		else if (parsedStr.type === "/") {
			return evaluate(parsedStr.left) / evaluate(parsedStr.right);
		}
	} else {
		throw new SyntaxError("Invalid expression.");
	}
}

function calculate() {
	var tokens = tokenize(document.getElementById("console-container").value.replace("=",""));
	var parsedStr = parse(tokens);
	document.getElementById("console-container").value = evaluate(parsedStr);
}

document.addEventListener('keyup', (e) => {
	if (e.code === "Enter") calculate();
});