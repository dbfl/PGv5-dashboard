$(document).ready(function(){
	var originalAmount;
	var confirmAmount;
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
	
	/****
	 * List of domain:
	 * var domain = "https://dev5.paygate.net/";
	 * var domain = "http://52.69.145.143/";
	 * var domain = "https://v5.paygate.net/";
	 * var domain = "http://localhost:8080/";
	 */
	 var domain = "https://dev5.paygate.net/";
	
	/****
	 * ENCRYPTION specifies how data would be send; either in encrypted format or un-encrypted format.
	 * To send un-encrypted data, comment out the statement ENCRYPTION = "ON". 
	 */
	
	ENCRYPTION = "ON";
	 
	$("#pageTop").trigger("click"); 
	
	$.fn.serializeAndEncode = function() {
	    return $.map(this.serializeArray(), function(val) {
	        return [val.name, encodeURIComponent(val.value)].join('=');
	    }).join('&');
	};
	
	$("#firstSection").click(function(){
		merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
	});
	
	$("#createMember").click(function(){
		alert(merchantGUID);
		var formData = decodeURIComponent($("#createForm").serializeAndEncode());
		var utf8encoded = pidCryptUtil.decodeUTF8(formData);
		var aes = new pidCrypt.AES.CTR();
		aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
		var crypted = aes.encrypt();
		var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
		
		if(ENCRYPTION=="ON"){
			sendRequestParam = params; 
		}else if(ENCRYPTION=="OFF"){
			sendRequestParam = formData;
		}else{}
		
		$.ajax({
				url:domain+'v5a/member/createMember?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					$("#createMemberReponse").html(JSON.stringify(data));
					$("#creationMessage").text("Member is not created, Please check the details below");
					$("#createMemberReponseContainer").show();
					
					if(data.status=="SUCCESS"){
						$("#creationMessage").text("Member is successfully created, Please check the details below");
						$(".toMemGuid").val(data.data.memGuid);
						$("#fromMemGuid").val(data.data.memGuid);
						reqMemguid = data.data.memGuid;
						
						var datas = "reqMemGuid="+ $("#merchantMemGuid").val() +"&toMemGuid="+data.data.memGuid;
						var utf8encoded = pidCryptUtil.encodeUTF8(datas);
						var aes = new pidCrypt.AES.CTR();
						aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
						var crypted = aes.encrypt();
						var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
						
						if(ENCRYPTION=="ON"){
							sendRequestParam = params; 
						}else if(ENCRYPTION=="OFF"){
							sendRequestParam = formData;
						}else{}
						
							$.ajax({
								url:domain+'v5a/activity/agreement/seyfert/balance?callback=?&_method=POST&'+sendRequestParam,
								type:'POST',
								dataType:'jsonp',
								error:function(){alert("error");},
								success:function(data){
									if(data.status=="SUCCESS"){}
								}
							});	
					}
					else if(data.data==null) {
						alert("please try again!");
						$("#firstSection").trigger("click");
					}
					else if(data.data !=null || data.status=="ERROR") {
						alert(data.message.cdKey);
						$("#firstSection").trigger("click");
					}
					else{}	
					 
				}
			});
		});
	
		$.ajax({
			url:domain+'v5a/vaccount/listAvailableBanks?callback=?&_method=GET',
			type:'GET',
			dataType:'jsonp',
			error:function(){alert("error");},
			success:function(data){
				var banklist = [];
				for(var i = 0; i < data.data.length;i++){
					banklist.push("<option value="+data.data[i].bankCode+">"+data.data[i].bankCode+"</option>");
				}
				$("#availBankList").append(banklist.join(''));
			}
		});	
		
		$("#assignVirtual").click(function(){
			var formData = $("#assignVirtualAccountForm").serialize();
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
			
			
			$.ajax({
				url: domain+'v5a/member/assignVirtualAccount?callback=?&_method=PUT&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					$("#assignVirtualAccountResponse").html(JSON.stringify(data));
					$("#assignVirtualAccountResponseCon").show();
					if(data.status=="SUCCESS"){
						$("#bankCodeSey").text(data.data.bnkCd);
						$("#virtualAccountNo").text(data.data.accntNo);
					}else{
						alert("Please try again!");
						$("#clickAssignVirtual").trigger("click");
					}
			    }
			});
		});
		
		$("#seyfertBalanceInquiry").click(function(){
			var formData = $("#seyfertBalanceInquiryForm").serialize();
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
			
			$.ajax({
				url:domain+'v5a/member/seyfert/balance?callback=?&_method=GET&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
						$("#seyfertBalanceResponse").html(JSON.stringify(data));
						$("#seyfertBalanceResponseCon").show();
					if(data.status=="SUCCESS"){
						originalAmount = data.data.moneyPair.amount;
						$("#scurrency").text(data.data.moneyPair.crrncy);
						$("#seyfertBalance").text(data.data.moneyPair.amount);
						
					}else{
						alert("Please try again!");
						$("#clickSeyfertBalance").trigger("click");
					}
			    }
			});
		});
		
		$("#seyfertTransferInquiry").click(function(){
			var formData = $("#seyfertTransferInquiryForm").serialize();
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
			
			$.ajax({
				url:domain+'v5/transaction/seyfert/transfer?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					$("#seyfertTransferResponse").html(JSON.stringify(data));
					$("#seyfertTransferResponseCon").show();
					if(data.status=="SUCCESS"){
						$("#seyfertTransferStatus").text(data.data.status);
						$("#transferId").text(data.data.tid);	
						parentid = data.data.tid;
						$("#escrowParentId").val(parentid);
						$("#seyfertCancelParentId").val(parentid);
						refId = data.data.info.refId;
						title = data.data.info.title;
					}else{
						alert("Please try again!");
						$("#clickSeyfertTransfer").trigger("click");
					}
			    }
			});
		});
		
		$("#seyfertBalanceInquiryAfter").click(function(){
			var formData = $("#seyfertBalanceInquiryFormAfter").serialize();
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
			
			$.ajax({
				url:domain+'v5a/member/seyfert/balance?callback=?&_method=GET&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					$("#seyfertBalanceResponseAfter").html(JSON.stringify(data));
					$("#seyfertBalanceResponseConAfter").show();
					if(data.status=="SUCCESS"){
						$("#seyfertBalanceAfter").text(data.data.moneyPair.amount);
						$("#scurrencyAfter").text(data.data.moneyPair.crrncy);
						confirmAmount = data.data.moneyPair.amount;
					}else{
						alert("Please try again!");
						$("#clickSeyfertBalance2").trigger("click");
					}
			    }
			});
		});
		
		$("#escrowReleaseInquiry").click(function(){
			//if(originalAmount != confirmAmount){ 
				var formData = $("#escrowReleaseContainer").serialize();
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
				
				$.ajax({
					url:domain+'v5/transaction/escrowRelease/request?callback=?&_method=POST&'+sendRequestParam,
					type:'POST',
					dataType:'jsonp',
					error:function(){alert("error");},
					success:function(data){
						$("#escrowReleaseResponseCon").show();
						$("#escrowReleaseResponse").html(JSON.stringify(data));
						if(data.status=="SUCCESS"){
							alert("escrow release confirm");
						}else{
							alert("escrow release error");
							//$("#escrowRelease").trigger("click");
						}
					}
				});	
			//}else{
				//alert("escrow release error");
			//}
		});
		
		
		$.ajax({
			url:domain+'v5a/code/detail/query?grpKey=BNK_CD&langCd=ko&callback=?&_method=GET',
			type:'GET',
			dataType:'jsonp',
			error:function(){alert("error");},
			success:function(data){
				var banklist = [];
				for(var i = 0; i < data.data.length;i++){
					banklist.push("<option value="+data.data[i].cdKey+">"+data.data[i].cdKey+"</option>");
				}
				$("#bnkCd").append(banklist.join(''));
			}
		});	
		
		$("#assignBankAccountBut").click(function(){
			var formData = $("#assignBankAccountForm").serialize();
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
			
			$.ajax({
				url:domain+'v5a/member/bnk?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					$("#bankAccountResponseCon").show();
					$("#bankAccountResponse").html(JSON.stringify(data));
					if(data.status=="SUCCESS"){
						
					}else{
						alert(data.status);
						$("#assignBankAccount").trigger("click");
					}
				}
			});	
		});
		
		
		$("#seyfertWithdraw").click(function(){
			var formData = $("#seyfertWithdrawForm").serialize();
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
			
			$.ajax({
				url:domain+'v5/transaction/seyfert/withdraw?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					alert(data.status);
				}
			});	
		});
		
		
		$("#seyfertCancelRequest").click(function(){
			 	var formData = $("#seyfertCancelContainer").serialize();
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
				
				$.ajax({
					url:domain+'v5/transaction/seyfertTransfer/cancel?callback=?&_method=POST&'+sendRequestParam,
					type:'POST',
					dataType:'jsonp',
					error:function(){alert("error");},
					success:function(data){
						 alert(data.status);
					}
				});	
			 
		});
		
			 
});
