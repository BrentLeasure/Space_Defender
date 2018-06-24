
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