$(document).ready(function () {
    $(":checkbox").click(function () {
        var thisVar = $(this);
        var id = thisVar.attr('id');
        var isChecked = thisVar.is(':checked');
        alert("id" + id + "   " + "Checked " + isChecked);
        //code to store it on local storage

    });
});