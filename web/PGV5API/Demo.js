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
	
	var HOST_URI = window.location.hostname;
	var TARGET_URI = "http://localhost:8080/";
	
	if(HOST_URI=="dev5.paygate.net"){TARGET_URI="https://dev5.paygate.net/";}
	if(HOST_URI=="stg5.paygate.net"){TARGET_URI="https://stg5.paygate.net/";}
	if(HOST_URI=="v5.paygate.net"){TARGET_URI="https://v5.paygate.net/";}
	
	var domain = TARGET_URI;
	
	window.location.href = domain+"/PGV5API/SeyfertDemo2.html";
	
	
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
	
	//$("#MATERGUID").focus();
	
	$("#firstSection").click(function(){
		merchantGUID = $("#masterGuid").val();
		KEY_ENC = $("#encryptKey").val();
		$(".merchantMemGuid").val($("#masterGuid").val());
	});
	
	$("#createMember").click(function(){
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
					alert(data.status);
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
						
							/*$.ajax({
								url:domain+'v5a/activity/agreement/seyfert/balance?callback=?&_method=POST&'+sendRequestParam,
								type:'POST',
								dataType:'jsonp',
								error:function(){alert("error");},
								success:function(data){
									if(data.status=="SUCCESS"){}
								}
							});*/	
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
					alert(data.status);
					
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
				url:domain+'v5/member/seyfert/inquiry/balance?callback=?&_method=GET&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					alert(data.status);
						$("#seyfertBalanceResponse").html(JSON.stringify(data));
						$("#seyfertBalanceResponseCon").show();
						
						$("#seyfertBalanceResponse2").html(JSON.stringify(data));
						$("#seyfertBalanceResponseCon2").show();
					if(data.status=="SUCCESS"){
						originalAmount = data.data.moneyPair.amount;
						$("#scurrency").text(data.data.moneyPair.crrncy);
						$("#seyfertBalance").text(data.data.moneyPair.amount);
						
						$("#scurrency2").text(data.data.moneyPair.crrncy);
						$("#seyfertBalance2").text(data.data.moneyPair.amount);
						
					}else{
						alert("Please try again!");
						$("#clickSeyfertBalance").trigger("click");
					}
			    }
			});
		});
		
		var counter = 0;
		var time = [];
		while(counter <= 59){
		    counter = counter + 1;
		    time.push("<option value="+counter+">"+counter+"</option>");
		}
		$("#timeout").append(time.join(''));
		
		$("#seyfertTransferReserved").click(function(){
			var formData = $("#seyfertTransferReservedForm").serialize();
			var utf8encoded = pidCryptUtil.encodeUTF8(formData);
			var aes = new pidCrypt.AES.CTR();
			aes.initEncrypt(utf8encoded, KEY_ENC, {nBits: bits});
			var crypted = aes.encrypt();
			var params = 'reqMemGuid='+merchantGUID+'&encReq='+encodeURIComponent(crypted);
			
			if(ENCRYPTION=="ON"){0
				sendRequestParam = params; 
			}else if(ENCRYPTION=="OFF"){
				sendRequestParam = formData;
			}else{}
			
			$.ajax({
				url:domain+'v5/transaction/seyfertTransfer/requestReserved?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					alert(data.status);
					
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
					alert(data.status);
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
						
						$("#sendMoneyTitle").val(title);
				
						
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
				url:domain+'v5/member/seyfert/inquiry/balance?callback=?&_method=GET&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					alert(data.status);
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
						alert(data.status);
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
					alert(data.status);
					$(".bankAccountResponseCon").show();
					$(".bankAccountResponse").html(JSON.stringify(data));
					if(data.status=="SUCCESS"){
						
					}else{
						alert(data.status);
						$("#assignBankAccount").trigger("click");
					}
				}
			});	
		});
		
		$("#inquireBankAccountOwnerNameBut").click(function(){
			var formData = $("#inquireBankAccountOwnerNameForm").serialize();
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
				url:domain+'v5/transaction/seyfert/checkbankname?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){ 
					alert(data.status);
					$(".InquireAccountOwnerNameResponseCon").show();
					$(".InquireAccountOwnerNameResponse").html(JSON.stringify(data));
				}
			});	
		});
		
		$("#inquireBankAccountOwnerBut").click(function(){
			var formData = $("#inquireBankAccountForm").serialize();
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
				url:domain+'v5/transaction/seyfert/checkbankcode?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					alert(data.status);
					$(".InquireAccountOwnerResponseCon").show();
					$(".InquireAccountOwnerResponse").html(JSON.stringify(data));
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
		
		
		$("#seyfertTransferPending").click(function(){
			var formData = $("#seyfertTransferPendingForm").serialize();
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
				url:domain+'v5/transaction/seyfert/transferPending?callback=?&_method=POST&'+sendRequestParam,
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
						$("#seyfertPendingCancelParentId").val(parentid);
						$("#seyfertPendingReleaseParentId").val(parentid);
						refId = data.data.info.refId;
						title = data.data.info.title;
					}else{
						alert("Please try again!");
						$("#clickSeyfertTransfer").trigger("click");
					}
			    }
			});
		});
		
		
		$("#seyfertPendingReleaseBut").click(function(){
		 	var formData = $("#seyfertPendingReleaseForm").serialize();
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
				url:domain+'v5/transaction/pending/release?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		$("#seyfertPendingCancelBut").click(function(){
		 	var formData = $("#seyfertPendingCancelForm").serialize();
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
				url:domain+'v5/transaction/seyfertTransferPending/cancel?callback=?&_method=POST&'+sendRequestParam,
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
		
		$("#recurringPayButton").click(function(){
			var formData = $("#recurringPayForm").serialize();
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
				url:domain+'v5/transaction/registerRecurring?callback=?&_method=POST&'+sendRequestParam,
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
						$("#recurringPayCancelParentId").val(parentid);
						refId = data.data.info.refId;
						title = data.data.info.title;
					}else{
						alert("Please try again!");
						$("#recurringPayCall").trigger("click");
					}
			    }
			});
		});
		
		$("#cancelRecurringPayButton").click(function(){
		 	var formData = $("#recurringPayCancelForm").serialize();
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
				url:domain+'v5/transaction/cancelRecurring?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		$("#sendMoneyButton").click(function(){
			var formData = $("#sendMoneyForm").serialize();
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
				url:domain+'v5/transaction/sendMoney?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		
		var caseCheck = $(".exchangeInquiryClass:checked").val();
		if(caseCheck=="case1"){
			$("#exchangeInquiryDstAmt").val('');
		}else{
			$("#exchangeInquirySrcAmt").val('');
		}
		
		$(".exchangeInquiryClass").click(function(){
			var value = $(this).val();
			if(value=="case1"){
				$("#exchangeInquiryDstAmt").val('');
			}else{
				$("#exchangeInquirySrcAmt").val('');
			}
		});
		
		$("#exchangeInquiryButton").click(function(){
			var formData = $("#exchangeInquiryForm").serialize();
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
				url:domain+'v5/exchange/inquiry?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		
		var caseCheck = $(".exchangeMoneyClass:checked").val();
		if(caseCheck=="case1"){
			$("#exchangeMoneyDstAmt").val('');
		}else{
			$("#exchangeMoneySrcAmt").val('');
		}
		
		$(".exchangeMoneyClass").click(function(){
			var value = $(this).val();
			if(value=="case1"){
				$("#exchangeMoneyDstAmt").val('');
			}else{
				$("#exchangeMoneySrcAmt").val('');
			}
		});
		
		$("#exchangeMoneyButton").click(function(){
			var formData = $("#exchangeMoneyForm").serialize();
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
				url:domain+'v5/exchange/process?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		
		$("#smsMoButton").click(function(){
			var formData = $("#smsMoForm").serialize();
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
				url:domain+'v5/transaction/util/mo?callback=?&_method=POST&'+sendRequestParam,
				type:'POST',
				dataType:'jsonp',
				error:function(){alert("error");},
				success:function(data){
					 alert(data.status);
				}
			});	
		});
		
		
		
		$("#uploadMemberImageForm").submit(function(){
			var formData = $("#uploadMemberImageForm").serialize();
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
			
			$("#uploadMemberImageForm").attr("action",domain+"v5/member/uploadMemImg");
			$("#uploadMemberImageForm").submit(params);
			
			$("#uploadResult").load(function(){
				var frame = $("#uploadResult").contents().find("body").html();
				alert(frame);
			});
			
			document.getElementById('uploadResult').onload = function() {
				var frame = document.getElementById('uploadResult').contentWindow.document.body.innerHTML;;
				$("#uploadResult").html(frame);
			};
			
		});	
});
