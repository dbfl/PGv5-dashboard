$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


$(document).ready(function(){
    var parentid;
    var reqMemguid;
    var refId;
    var title;
    var encryptData;
    var bits = 256;
    var merchantGUID;
    var KEY_ENC;
    var ENCRYPTION = "OFF";
    var sendRequestParam;
    var responseMessage;
    var responseDataConsole = [];
    window.location = "FuiouDemo.html#page1";

    /****
     * List of domain:
     * var domain = "https://dev5.paygate.net/";
     * var domain = "http://52.69.145.143/";
     * var domain = "http://localhost:8080/";
     */

    var HOST_URI = window.location.hostname;
    var TARGET_URI = "http://localhost:8080/";



    if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
    if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
    if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}

    var domain = TARGET_URI;

    /****
     * ENCRYPTION specifies how data would be send; either in encrypted format or un-encrypted format.
     * To send un-encrypted data, comment out the statement ENCRYPTION = "ON".
     */

    //ENCRYPTION = "ON";
    ENCRYPTION = "OFF";

    /**ENCRYPT DATA GENERATOR**/
    $(".resultSet").val('');


    /**MEMBER RELATED CODE BEGIN***/
    $(".menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $(".navigator").click(function(){
        $(".navigator").removeClass("active");
        $(this).addClass("active");
    });

    $(".showExtraParams").click(function(e) {
        e.preventDefault();

        if($(this).find('span').html()=="+")
        {
            $(this).find('span').html("-");
        } else {
            $(this).find('span').html("+");
        }

        $(this).siblings(".extraParams").toggle();
    });

    $("#firstSection").click(function(){
        if($( ".transactionSubMenu" ).is( ":visible" ) ==true){
            $( ".transactionSubMenu" ).toggle();
            $("#transactionToggleIcon").html("[+]");
        }

        if($( ".AccountSubMenu" ).is( ":visible" )===true){
            $( ".AccountSubMenu" ).toggle();
            $("#accountToggleIcon").html("[+]");
        }

        merchantGUID = $("#masterGuid").val();
        KEY_ENC = $("#encryptKey").val();
        $(".merchantMemGuid").val($("#masterGuid").val());
    });

    $("#toggleConsole").click(function(e) {
        e.preventDefault();
        //$("#itemContent").toggle();
        $("#itemContent").toggle(
            function(){
                var isVisible = $( "#itemContent" ).is( ":visible" );
                if(isVisible===true){
                    $("#toggleIcon").html("[-]");
                    $("#page-content-wrapper").css("height","589px");
                    $("#footer").css("position","");
                    $("#footer").css("bottom","");
                }else{
                    $("#toggleIcon").html("[+]");
                    $("#page-content-wrapper").css("height","100%");
                    $("#footer").css("position","fixed");
                    $("#footer").css("bottom","0");
                }
            });
    });

    /** side bar **/

    $("#transactionMenu").click(function(){
        $(".transactionSubMenu").toggle(
            function(){
                var isVisible = $( ".transactionSubMenu" ).is( ":visible" );
                if(isVisible===true){
                    $("#transactionToggleIcon").html("[-]");
                    $("#payin").trigger("click");
                }else{
                    $("#transactionToggleIcon").html("[+]");
                }
            });
        if($( ".AccountSubMenu" ).is( ":visible" )===true){
            $( ".AccountSubMenu" ).toggle();
            $("#accountToggleIcon").html("[+]");
        }
    });

    $("#AccountMenu").click(function(){
        $(".AccountSubMenu").toggle(
            function(){
                var isVisible = $( ".AccountSubMenu" ).is( ":visible" );
                if(isVisible===true){
                    $("#accountToggleIcon").html("[-]");
                    $("#setJumpingPage").trigger("click");
                }else{
                    $("#accountToggleIcon").html("[+]");
                }
            });
        if($( ".transactionSubMenu" ).is( ":visible" )===true){
            $( ".transactionSubMenu" ).toggle();
            $("#transactionToggleIcon").html("[+]");
        }
    });

    /** transaction **/

    $("#getBankListButton").click(function() {
        $("#console").empty();
        var formData = $("#getBankListForm").serialize();
        var utf8encoded = pidCryptUtil.encodeUTF8(formData);
        var aes = new pidCrypt.AES.CTR();
        aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
        var crypted = aes.encrypt();
        var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);

        if(ENCRYPTION=="ON"){
            sendRequestParam = params;
        }else if(ENCRYPTION=="OFF"){
            sendRequestParam = formData;
        }else{}

        responseDataConsole.push("<span style=color:#0051A8><b>GET BANK LIST</b> </span> <br>");
        responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/chinacash/bankList' +"<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br>callback=?&_method=POST&"+ formData + "<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br>callback=?&_method=POST&"+ params + "<br>");

        var items = $("#getBankListForm :input").map(function(index, elm) {
            return {name: elm.name, type:elm.type, value: $(elm).val()};
        });

        var paramsTable = [];
        paramsTable.push("<table border=1 style=width:40%>");
        paramsTable.push("<tr style='color:#D9534F;'>");
        paramsTable.push("<th class=thMargin>Param</th>");
        paramsTable.push("<th class=thMargin>Value</th>");
        paramsTable.push("</tr>");
        paramsTable.push("<tr>");

        $.each(items, function(i, d){
            //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
            paramsTable.push("<tr>");
            paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");
            paramsTable.push("<td class=thMargin>"+d.value+"</td>");
            paramsTable.push("</tr>");
        });
        paramsTable.push("</table>");
        responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");

        $.ajax({
            url:domain+'v5/chinacash/bankList?callback=?&_method=POST&'+sendRequestParam,
            type:'POST',
            dataType:'jsonp',
            error:function(){alert("error");},
            success:function(data){
                alert(data.status);
                responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
                if(data.status=="SUCCESS"){
                    responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));
                }
                else if(data.status !="SUCCESS"){
                    alert("Please try again!");
                    responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));

                    $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
                    return false;
                }

            }
        });

        $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
        return false;
    });

    $("#payinButton").click(function() {
        $("#console").empty();
        var formData = $("#payinForm").serialize();
        var utf8encoded = pidCryptUtil.encodeUTF8(formData);
        var aes = new pidCrypt.AES.CTR();
        aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
        var crypted = aes.encrypt();
        var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);

        if(ENCRYPTION=="ON"){
            sendRequestParam = params;
        }else if(ENCRYPTION=="OFF"){
            sendRequestParam = formData;
        }else{}

        responseDataConsole.push("<span style=color:#0051A8><b>GET BANK LIST</b> </span> <br>");
        responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/chinacash/payin' +"<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br>callback=?&_method=POST&"+ formData + "<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br>callback=?&_method=POST&"+ params + "<br>");

        var items = $("#payinForm :input").map(function(index, elm) {
            return {name: elm.name, type:elm.type, value: $(elm).val()};
        });

        var paramsTable = [];
        paramsTable.push("<table border=1 style=width:40%>");
        paramsTable.push("<tr style='color:#D9534F;'>");
        paramsTable.push("<th class=thMargin>Param</th>");
        paramsTable.push("<th class=thMargin>Value</th>");
        paramsTable.push("</tr>");
        paramsTable.push("<tr>");

        $.each(items, function(i, d){
            //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
            paramsTable.push("<tr>");
            paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");
            paramsTable.push("<td class=thMargin>"+d.value+"</td>");
            paramsTable.push("</tr>");
        });
        paramsTable.push("</table>");
        responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");

        $.ajax({
            url:domain+'v5/chinacash/payin?callback=?&_method=POST&'+sendRequestParam,
            type:'POST',
            dataType:'jsonp',
            error:function(){alert("error");},
            success:function(data){
                alert(data.status);
                responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
                if(data.status=="SUCCESS") {
                    responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));
                    var json = data.data;
                    $('#fuiouform *').remove();
                    $('#fuiouform').attr('action',json['fuiou_post_url']);
                    $('#fuiouform').attr('method','post');
                    for(key in json){
                        if(key != 'fuiou_post_url' && key != 'e2e'){
                            $('#fuiouform').append('<input type="hidden" name="'+ key +'" value="'+json[key]+'" />');
                        }
                    }
                    var widthSize = 800;
                    var heightSize = 800;
                    var leftPos = (screen.width - widthSize) / 2;
                    var topPos = (screen.height - heightSize) / 2;
                    var winProps = 'scrollbars =yes, resizable=yes, copyhistory=no, width='+widthSize+', height='+heightSize+'+, left='+leftPos+', top='+topPos+'';
                    window.open(json['fuiou_post_url'],'popup', winProps);
                    $('#fuiouform').attr('target','popup');
                    $('#fuiouform').submit();
                }
                else if(data.status !="SUCCESS"){
                    alert("Please try again!");
                    responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));

                    $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
                    return false;
                }

            }
        });

        $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
        return false;
    });


    $("#cancelButton").click(function() {
        $("#console").empty();
        var formData = $("#cancelForm").serialize();
        var utf8encoded = pidCryptUtil.encodeUTF8(formData);
        var aes = new pidCrypt.AES.CTR();
        aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
        var crypted = aes.encrypt();
        var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);

        if(ENCRYPTION=="ON"){
            sendRequestParam = params;
        }else if(ENCRYPTION=="OFF"){
            sendRequestParam = formData;
        }else{}

        responseDataConsole.push("<span style=color:#0051A8><b>GET BANK LIST</b> </span> <br>");
        responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/chinacash/cancel' +"<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br>callback=?&_method=POST&"+ formData + "<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br>callback=?&_method=POST&"+ params + "<br>");

        var items = $("#cancelForm :input").map(function(index, elm) {
            return {name: elm.name, type:elm.type, value: $(elm).val()};
        });

        var paramsTable = [];
        paramsTable.push("<table border=1 style=width:40%>");
        paramsTable.push("<tr style='color:#D9534F;'>");
        paramsTable.push("<th class=thMargin>Param</th>");
        paramsTable.push("<th class=thMargin>Value</th>");
        paramsTable.push("</tr>");
        paramsTable.push("<tr>");

        $.each(items, function(i, d){
            //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
            paramsTable.push("<tr>");
            paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");
            paramsTable.push("<td class=thMargin>"+d.value+"</td>");
            paramsTable.push("</tr>");
        });
        paramsTable.push("</table>");
        responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");

        $.ajax({
            url:domain+'v5/chinacash/cancel?callback=?&_method=POST&'+sendRequestParam,
            type:'POST',
            dataType:'jsonp',
            error:function(){alert("error");},
            success:function(data){
                alert(data.status);
                responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
                if(data.status=="SUCCESS"){
                    responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));
                }
                else if(data.status !="SUCCESS"){
                    alert("Please try again!");
                    responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));

                    $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
                    return false;
                }

            }
        });

        $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
        return false;
    });

    $("#jmpButton").click(function() {
        $("#console").empty();
        var formData = $("#jmpForm").serialize();
        var utf8encoded = pidCryptUtil.encodeUTF8(formData);
        var aes = new pidCrypt.AES.CTR();
        aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
        var crypted = aes.encrypt();
        var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);

        if(ENCRYPTION=="ON"){
            sendRequestParam = params;
        }else if(ENCRYPTION=="OFF"){
            sendRequestParam = formData;
        }else{}

        responseDataConsole.push("<span style=color:#0051A8><b>GET BANK LIST</b> </span> <br>");
        responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/chinacash/cancel' +"<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br>callback=?&_method=POST&"+ formData + "<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br>callback=?&_method=POST&"+ params + "<br>");

        var items = $("#jmpForm :input").map(function(index, elm) {
            return {name: elm.name, type:elm.type, value: $(elm).val()};
        });

        var paramsTable = [];
        paramsTable.push("<table border=1 style=width:40%>");
        paramsTable.push("<tr style='color:#D9534F;'>");
        paramsTable.push("<th class=thMargin>Param</th>");
        paramsTable.push("<th class=thMargin>Value</th>");
        paramsTable.push("</tr>");
        paramsTable.push("<tr>");

        $.each(items, function(i, d){
            //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
            paramsTable.push("<tr>");
            paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");
            paramsTable.push("<td class=thMargin>"+d.value+"</td>");
            paramsTable.push("</tr>");
        });
        paramsTable.push("</table>");
        responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");

        $.ajax({
            url:domain+'v5a/chinacash/account/jumpingpage?callback=?&_method=POST&'+sendRequestParam,
            type:'POST',
            dataType:'jsonp',
            error:function(){alert("error");},
            success:function(data){
                alert(data.status);
                responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
                if(data.status=="SUCCESS"){
                    responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));
                }
                else if(data.status !="SUCCESS"){
                    alert("Please try again!");
                    responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));

                    $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
                    return false;
                }

            }
        });

        $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
        return false;
    });

    $("#notifyButton").click(function() {
        $("#console").empty();
        var formData = $("#notifyForm").serialize();
        var utf8encoded = pidCryptUtil.encodeUTF8(formData);
        var aes = new pidCrypt.AES.CTR();
        aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
        var crypted = aes.encrypt();
        var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);

        if(ENCRYPTION=="ON"){
            sendRequestParam = params;
        }else if(ENCRYPTION=="OFF"){
            sendRequestParam = formData;
        }else{}

        responseDataConsole.push("<span style=color:#0051A8><b>GET BANK LIST</b> </span> <br>");
        responseDataConsole.push("<span style='color:#D9534F'><b>URL: </b></span>"+ domain+'v5/chinacash/cancel' +"<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Parameters:</b></span><br>callback=?&_method=POST&"+ formData + "<br>");
        responseDataConsole.push("<span style=word-break: break-all><b>Encrypted Parameters:</b></span><br>callback=?&_method=POST&"+ params + "<br>");

        var items = $("#notifyForm :input").map(function(index, elm) {
            return {name: elm.name, type:elm.type, value: $(elm).val()};
        });

        var paramsTable = [];
        paramsTable.push("<table border=1 style=width:40%>");
        paramsTable.push("<tr style='color:#D9534F;'>");
        paramsTable.push("<th class=thMargin>Param</th>");
        paramsTable.push("<th class=thMargin>Value</th>");
        paramsTable.push("</tr>");
        paramsTable.push("<tr>");

        $.each(items, function(i, d){
            //$("body").append("<div>Name:" + d.name + " Type: " +  d.type + " Value: " + d.value + "</div>");
            paramsTable.push("<tr>");
            paramsTable.push("<td class=thMargin><b>"+d.name+"</b></td>");
            paramsTable.push("<td class=thMargin>"+d.value+"</td>");
            paramsTable.push("</tr>");
        });
        paramsTable.push("</table>");
        responseDataConsole.push("<span><b>Parameters Details:</b></span><br>"+paramsTable.join('')+"<br>");

        $.ajax({
            url:domain+'v5a/chinacash/account/notifyurl?callback=?&_method=POST&'+sendRequestParam,
            type:'POST',
            dataType:'jsonp',
            error:function(){alert("error");},
            success:function(data){
                alert(data.status);
                responseDataConsole.push("<b>Response Status: "+data.status+"</b><br>");
                if(data.status=="SUCCESS"){
                    responseDataConsole.push("<span> <b>JsonData:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));
                }
                else if(data.status !="SUCCESS"){
                    alert("Please try again!");
                    responseDataConsole.push("\n <span style='background-color:red;color:#ffffff'> <b>Error:</b> <br>" + JSON.stringify(data) + "</span><br>");
                    responseDataConsole.push("=========================== <br>");
                    $("#console").append(responseDataConsole.join(""));

                    $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
                    return false;
                }

            }
        });

        $("#itemContent").animate({ scrollTop: $(document).height() }, "slow");
        return false;
    });
});