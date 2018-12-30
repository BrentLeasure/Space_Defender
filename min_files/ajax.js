
function create_user() { 
	var formData = new FormData();

	var the_form = document.getElementById( "create-user-form" ).children;

	for( var i = 0; i < the_form.length; i++ ) {

		if ( 'text' == the_form[i].type || 'password' == the_form[i].type ) {
			formData.append( the_form[i].name, the_form[i].value );
		} else if ( 'file' == the_form[i].type ) {
			formData.append( the_form[i].name, the_form[i].files[0], the_form[i].files[0].name); 
		}
	}

	$.ajax( {
		method	: 'POST',
		url		: '/create/new_user',
		data 	: formData,
		processData: false,  
	    contentType: false,
		success : function() {
			console.log('Back!');
		}
	});
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhamF4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuZnVuY3Rpb24gY3JlYXRlX3VzZXIoKSB7IFxuXHR2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcblxuXHR2YXIgdGhlX2Zvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJjcmVhdGUtdXNlci1mb3JtXCIgKS5jaGlsZHJlbjtcblxuXHRmb3IoIHZhciBpID0gMDsgaSA8IHRoZV9mb3JtLmxlbmd0aDsgaSsrICkge1xuXG5cdFx0aWYgKCAndGV4dCcgPT0gdGhlX2Zvcm1baV0udHlwZSB8fCAncGFzc3dvcmQnID09IHRoZV9mb3JtW2ldLnR5cGUgKSB7XG5cdFx0XHRmb3JtRGF0YS5hcHBlbmQoIHRoZV9mb3JtW2ldLm5hbWUsIHRoZV9mb3JtW2ldLnZhbHVlICk7XG5cdFx0fSBlbHNlIGlmICggJ2ZpbGUnID09IHRoZV9mb3JtW2ldLnR5cGUgKSB7XG5cdFx0XHRmb3JtRGF0YS5hcHBlbmQoIHRoZV9mb3JtW2ldLm5hbWUsIHRoZV9mb3JtW2ldLmZpbGVzWzBdLCB0aGVfZm9ybVtpXS5maWxlc1swXS5uYW1lKTsgXG5cdFx0fVxuXHR9XG5cblx0JC5hamF4KCB7XG5cdFx0bWV0aG9kXHQ6ICdQT1NUJyxcblx0XHR1cmxcdFx0OiAnL2NyZWF0ZS9uZXdfdXNlcicsXG5cdFx0ZGF0YSBcdDogZm9ybURhdGEsXG5cdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLCAgXG5cdCAgICBjb250ZW50VHlwZTogZmFsc2UsXG5cdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0JhY2shJyk7XG5cdFx0fVxuXHR9KTtcbn0iXSwiZmlsZSI6ImFqYXguanMifQ==
