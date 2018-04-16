$(document).ready(function(){
	// popup
	$( "#dialog-message" ).dialog({
		autoOpen:false,
		modal: true,
		width: "70%",
		maxWidth: "800",
		height: "700",
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		open: function(){
			$("body").css("overflow", "hidden");
		},
		close: function(){
				$("body").css("overflow", "auto");
		}
	});
	$( "#opener" ).on( "click", function() {
		$( "#dialog-message" ).dialog( "open" );
	});

	//datepicker
	var dateFormat = "yy-mm-dd",
		from = $( "#from" )
			.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 1
			})
			.on( "change", function() {
				to.datepicker( "option", "minDate", getDate( this ) );
			}),
		to = $( "#to" ).datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		})
		.on( "change", function() {
			from.datepicker( "option", "maxDate", getDate( this ) );
		});

	function getDate( element ) {
		var date;
		try {
			date = $.datepicker.parseDate( dateFormat, element.value );
		} catch( error ) {
			date = null;
		}

		return date;
	}
});


