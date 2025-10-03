// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to header
    let lastScroll = 0;
    const header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Set first section (hero) to visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }
});
function showCategory(categoryId) {
    // Hide all product sections
    document.querySelectorAll('#product-sections .products').forEach(sec => {
        sec.classList.add('hidden');
    });

    // Show selected section
    const selected = document.getElementById(categoryId);
    if (selected) {
        selected.classList.remove('hidden');
        selected.scrollIntoView({ behavior: 'smooth' });
    }
}
// --------- START: Dynamic Products via JS ---------
(function() {
  const PRODUCTS = {
    "Traditional Sweets": [
      { id: "mysorepak", name: "Mysore Pak", price: "₹250", img: "image/1.jpg" },
      { id: "laddu", name: "Laddu", price: "₹200", img: "image/1.jpg" },
      { id: "jalebi", name: "Jalebi", price: "₹180", img: "image/1.jpg" }
    ],
    "Savory Snacks": [
      { id: "murukku", name: "Murukku", price: "₹150", img: "image/1.jpg" },
      { id: "mixture", name: "Mixture", price: "₹180", img: "image/1.jpg" },
      { id: "pakoda", name: "Pakoda", price: "₹120", img: "image/1.jpg" }
    ],
    "Festive Specials": [
      { id: "diwalibox", name: "Diwali Special Box", price: "₹1200 ", img: "image/1.jpg" }
    ],
    "Bulk Orders": [
      { id: "bulk-laddu-5kg", name: "Laddu Bulk (5Kg)", price: "₹4000", img: "image/1.jpg" }
    ]
  };

  function orderNow(productName, price) {
    const phoneNumber = "919344715650";
    const message = `Hello, I would like to order:\n\nProduct: ${productName}\nPrice: ${price}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }
  window.orderNow = orderNow; // keep global

  function el(tag, options = {}) {
    const e = document.createElement(tag);
    if (options.cls) e.className = options.cls;
    if (options.text) e.textContent = options.text;
    if (options.html) e.innerHTML = options.html;
    if (options.attrs) Object.entries(options.attrs).forEach(([k,v]) => e.setAttribute(k,v));
    return e;
  }

  function renderProductCard(item) {
    const card = el('div', { cls: 'product-card' });
    card.appendChild(el('img', { attrs: { src: item.img, alt: item.name } }));
    card.appendChild(el('h3', { text: item.name }));
    card.appendChild(el('span', { cls: 'price', text: item.price }));
    const btn = el('button', { cls: 'order-btn', html: '🛒 Add to Cart' });
btn.addEventListener('click', () => {
  const user = JSON.parse(localStorage.getItem('abi_user'));
  if (!user) {
    alert("⚠️ Please login before adding items to your cart.");
    document.getElementById("loginModal").style.display = "block";
    return;
  }
  addToCart(item);
});
card.appendChild(btn);

    return card;
  }

  function renderCategorySection(categoryName, items) {
    const section = el('section', { cls: 'products' });
    section.id = `cat-${categoryName.replace(/\s+/g, '-').toLowerCase()}`;
    const container = el('div', { cls: 'container' });
    container.appendChild(el('div', { cls: 'section-header', html: `<h2>${categoryName}</h2>` }));
    const grid = el('div', { cls: 'products-grid' });
    items.forEach(it => grid.appendChild(renderProductCard(it)));
    container.appendChild(grid);
    section.appendChild(container);
    section.style.display = 'none';
    return section;
  }

  function renderAllProductSections() {
    const placeholder = document.getElementById('product-sections-placeholder');
    placeholder.innerHTML = '';
    Object.entries(PRODUCTS).forEach(([cat, items]) => {
      placeholder.appendChild(renderCategorySection(cat, items));
    });
  }

  function showCategoryByName(categoryName) {
    const placeholder = document.getElementById('product-sections-placeholder');
    Array.from(placeholder.children).forEach(section => {
      if (section.id === `cat-${categoryName.replace(/\s+/g, '-').toLowerCase()}`) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        section.style.display = 'none';
      }
    });
  }

  function attachSpecialtyClicks() {
    const cards = document.querySelectorAll('.specialty-card');
    cards.forEach(card => {
      const h3 = card.querySelector('h3');
      const categoryName = h3 ? h3.textContent.trim() : null;
      if (!categoryName) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() {
        if (!document.getElementById('product-sections-placeholder').hasChildNodes()) {
          renderAllProductSections();
        }
        showCategoryByName(categoryName);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attachSpecialtyClicks);
})();
// 🔐 LOGIN POPUP LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");
  const openBtn = document.getElementById("loginOpenBtn");
  const closeBtn = document.getElementById("closeLogin");
  const form = document.getElementById("loginForm");

  // Open modal
  openBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.style.display = "block";
  });

  // Close modal
  closeBtn?.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // Save login data
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (name && email && password) {
      localStorage.setItem("abi_user", JSON.stringify({ name, email }));
      alert(`Welcome ${name}! You are logged in ✅`);
      loginModal.style.display = "none";
      updateLoginNav(name);
    }
  });

  // Update nav if already logged in
  const savedUser = JSON.parse(localStorage.getItem("abi_user"));
  if (savedUser?.name) {
    updateLoginNav(savedUser.name);
  }
});

// ✅ Update nav after login
function updateLoginNav(name) {
  const btn = document.getElementById("loginOpenBtn");
  if (btn) {
    btn.textContent = `Hi, ${name} (Logout)`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("abi_user");
      alert("Logged out ✅");
      location.reload();
    });
  }
}
function addToCart(item) {
  let cart = JSON.parse(localStorage.getItem('abi_cart')) || [];
  const existing = cart.find(p => p.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem('abi_cart', JSON.stringify(cart));
  alert("✅ Item added to cart!"); // 👈 Userக்கு confirmation
}
localStorage.removeItem("abi_cart");
function removeItemFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("abi_cart")) || [];
  cart = cart.filter(item => item.id !== id);  // ✅ இதுவே முக்கியம்
  localStorage.setItem("abi_cart", JSON.stringify(cart));
  alert("Item removed!");
  location.reload();
}
localStorage.clear();


