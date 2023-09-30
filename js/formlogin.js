const loginButton = document.getElementById('button-login');
loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  const naam = document.getElementById('input-naam').value;
  const admin = document.getElementById('check-admin').checked;
  console.log(`naam: ${naam}`);
  console.log(`admin: ${admin}`);
});
