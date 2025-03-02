const menu = document.getElementById("menu");

const cartBtn = document.getElementById("cart-btn");

const cartModal = document.getElementById("cart-modal");

const cartItemsContainer = document.getElementById("cart-items");

const cartTotal = document.getElementById("cart-total");

const checkoutBtn = document.getElementById("checkout-btn");

const closeCartModalBtn = document.getElementById("close-modal-btn");

const cartCounter = document.getElementById("cart-count");

const adressInput = document.getElementById("adress");

const adressWarn = document.getElementById("adress-warn");


let cart = [];


// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
}); 

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
})


closeCartModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
}); 





menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price);
    }
})  




// Função para adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();    
}


// Atualizar o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtde: ${item.quantity}</p>
                    <p class="font-medium mt-2">Preço: R$ ${item.price.toFixed(2)}</p>
                </div>


                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

            </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency", 
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");        
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}
            
adressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if (inputValue === "") {
        adressInput.classList.remove("border-red-500");
        adressWarn.classList.add("hidden");
    }
})  


async function getWhatsAppNumber() {
    try {
        const response = await fetch("https://devburguer.onrender.com/api/whatsapp");
        const data = await response.json();
        return data.phone;
    } catch (error) {
        console.error("Erro ao buscar número do WhatsApp:", error);
        return null;
    }
}

async function sendWhatsAppMessage(cart, address) {
    const phone = await getWhatsAppNumber(); // Busca o número de WhatsApp do backend

    if (!phone) {
        console.error("Número do WhatsApp não encontrado.");
        return;
    }

    // Monta a mensagem com os itens do carrinho
    let message = "🍔 *Pedido DevBurguer* 🍔%0A%0A";
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} - R$${item.price.toFixed(2)}%0A`;
    });

    message += `%0A📍 *Endereço de entrega:* ${address}`;
    message += "%0A%0AObrigado pelo pedido! 🚀";

    // Cria a URL do WhatsApp com o número e a mensagem formatada
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // Redireciona para o WhatsApp
    window.open(whatsappUrl, "_blank");
}

// Finalizar pedido
checkoutBtn.addEventListener("click", async function () {
    const isOpen = checkRestaurantOpen();

    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (adressInput.value === "") {
        adressWarn.classList.remove("hidden");
        adressInput.classList.add("border-red-500");
        return;
    }

    // Nova função para enviar o pedido ao WhatsApp
    await sendWhatsAppMessage(cart, adressInput.value);

    cart = [];
    updateCartModal();
});


// Verificar a hora e manipular o card de horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}

// Lógica do título do menu
document.addEventListener("DOMContentLoaded", function () {
    const text = "Conheça nosso Menu...";
    let index = 0;
    const titleElement = document.getElementById("menuTitle");

    function typeWriter() {
        if (index < text.length) {
            titleElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100); // Velocidade da digitação
        }
    }

    typeWriter();
});