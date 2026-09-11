fetch("/api/me")
    .then(res => res.json())
    .then(data => {
        const loginLink = document.querySelector('a[href$="login.html"]');
        if (data.loggedIn && loginLink) {
            loginLink.textContent = "Member Dashboard"
            loginLink.href = "/pages/logged-in.html"
        }
    });