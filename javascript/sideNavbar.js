function populateSideNavbar() {
	let div = document.getElementById('profile_pic');
	let pic = document.createElement('img');
	pic.classList.add('profile_pic');
	let source = localStorage.getItem('profile_image');

	div.appendChild(pic);

	let namep = document.getElementsByClassName('navname')[0];
	let name = document.createTextNode(localStorage.getItem('first_name') + " " + localStorage.getItem('last_name'));
	namep.appendChild(name);
}