/*
 * 用于页面自定义插件与方法
 */
/*设定验证码库*/
var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '1','2','3','4','5','6','7','8','9','10','11','12'); 
/*创建验证码*/
function createCode(){
	var code = "";
    var codeLength = 4; //验证码的长度
    var checkCode = document.getElementById("checkCode");
    for (var i = 0; i < codeLength; i++) {
        var charNum = Math.floor(Math.random() * 52);
        code += codeChars[charNum];
    }
    if (checkCode) {
        checkCode.className = "code";
        checkCode.innerHTML = code;
    }
}