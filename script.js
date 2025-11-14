const products = [
  { id: "p1", title: "Smartphone", price: 17999, desc: "6.7-inch display, 5000mAh battery", img: "/images/phone.jpg" },
  { id: "p2", title: "Laptop", price: 55999, desc: "Intel i5, 16GB RAM, 512GB SSD", img: "/images/laptop.jpg" },
  { id: "p3", title: "Smart Watch", price: 2999, desc: "AMOLED screen, heart rate monitor", img: "/images/smart-watch.jpg" },
  { id: "p4", title: "Headphones", price: 1999, desc: "Noise-cancelling wireless headphones", img: "/images/headphones.jpeg" },
  { id: "p5", title: "Camera", price: 35999, desc: "24MP DSLR camera with lens kit", img: "/images/camera.jpg" }
];

function renderProducts() {
  const list = document.getElementById("product-list");
  const select = document.getElementById("reviewProduct");
  list.innerHTML = "";
  select.innerHTML = "";

  products.forEach((p) => {
    const div = document.createElement("div");
    div.className = "prod";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="prod-content">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <strong>₹${p.price}</strong><br><br>
        <button onclick="addWishlist('${p.title}')">♡ Wishlist</button>
        <button onclick="placeOrder('${p.title}')">🛒 Order</button>
      </div>`;
    list.appendChild(div);

    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.title;
    select.appendChild(opt);
  });
}

/* ====== AUTH ====== */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
function setCurrentUser(user) {
  if (user) localStorage.setItem("currentUser", JSON.stringify(user));
  else localStorage.removeItem("currentUser");
  renderAuth();
}

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = regName.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const phone = regPhone.value.trim();
  const pass = regPass.value;

  if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Invalid email");
  if (!/^\d{10,15}$/.test(phone)) return alert("Invalid phone number");
  if (pass.length < 6) return alert("Password too short");

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find((u) => u.email === email)) return alert("Email already registered");
  users.push({ name, email, phone, pass });
  localStorage.setItem("users", JSON.stringify(users));
  setCurrentUser({ name, email });
  alert("Registration successful!");
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim().toLowerCase();
  const pass = loginPass.value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const u = users.find((x) => x.email === email && x.pass === pass);
  if (!u) return alert("Invalid credentials");
  setCurrentUser({ name: u.name, email: u.email });
  alert("Login successful!");
});

document.getElementById("logout").addEventListener("click", () => {
  setCurrentUser(null);
});

function renderAuth() {
  const user = getCurrentUser();
  const panel = document.getElementById("user-panel");
  const forms = document.getElementById("auth-forms");
  if (user) {
    forms.style.display = "none";
    panel.style.display = "block";
    userGreet.textContent = "Welcome, " + user.name;
    userEmail.textContent = user.email;
  } else {
    forms.style.display = "flex";
    panel.style.display = "none";
  }
}

/* ====== Wishlist & Orders ====== */
function addWishlist(item) {
  const user = getCurrentUser();
  if (!user) return alert("Please login first");
  alert(item + " added to your wishlist!");
}
function placeOrder(item) {
  const user = getCurrentUser();
  if (!user) return alert("Please login first");
  alert("Order placed for " + item + "!");
}

/* ====== Reviews ====== */
function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  const list = document.getElementById("reviews-list");
  list.innerHTML = "";
  reviews.slice().reverse().forEach((r) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${r.user}</strong> (${r.rating}★): ${r.text} – <em>${r.product}</em>`;
    list.appendChild(li);
  });
}

document.getElementById("review-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = reviewText.value.trim();
  const rating = parseInt(reviewRating.value);
  const product = reviewProduct.options[reviewProduct.selectedIndex].text;
  const user = getCurrentUser();
  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  reviews.push({ user: user ? user.name : "Anonymous", text, rating, product });
  localStorage.setItem("reviews", JSON.stringify(reviews));
  reviewForm.reset();
  renderReviews();
});

/* ====== Customer Care ====== */
document.getElementById("care-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Your message has been sent! We’ll contact you soon.");
  e.target.reset();
});

/* ====== INIT ====== */
renderProducts();
renderAuth();
renderReviews();
