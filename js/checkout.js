let Checkout = (function() {
  let Private = {
    DOM: {
      billingTableTemplate: document.getElementById("template-billing-table"),
      billingTable: document.querySelector(".item-body"),
      checkoutButton: document.getElementById("checkoutButton"),
      form: document.getElementById("checkout-form")
    },
    State: {
      data: { items: JSON.parse(localStorage.getItem("items")) },
      url: "http://5d6fd14c482b530014d2e886.mockapi.io/beer"
    },
    Events: {
      tableFill: function() {
        // Total price count
        let total = 0;

        // Get items
        let items = Private.State.data.items;

        // Total count of all items
        items.forEach(item => {
          total += Math.ceil(item.quantity * item.attenuation_level);
        });

        //  Add total to UI
        let tableTotal = document.querySelector(".total");
        tableTotal.textContent = `$${total}`;

        // Render table to UI
        Private.DOM.billingTable.innerHTML = Handlebars.compile(
          Private.DOM.billingTableTemplate.innerHTML
        )(Private.State.data);
      },
      postTable: function() {
        Private.DOM.form.addEventListener("submit", function(e) {
          if (Private.DOM.form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();

            // Animate to top
            $("html, body").animate({ scrollTop: 100 }, "slow");

            // Show alert message
            $(".alert-message")
              .show()
              .animate({ opacity: "1" }, "slow");

            setTimeout(() => {
              $(".alert-message").animate({ opacity: "0" }, "slow");
            }, 3000);
          } else {
            e.preventDefault();
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const street = document.getElementById("street").value;
            const country = document.getElementById("country").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;
            const note = document.getElementById("note").value;

            const items = Private.State.data.items;
            let list = items.map(item => {
              let name = item.name;
              let quantity = item.quantity;
              let price = item.attenuation_level;

              return {
                name,
                quantity,
                price
              };
            });

            const data = {
              firstName,
              lastName,
              street,
              country,
              phone,
              email,
              note,
              list
            };

            axios.post(Private.State.url, data);

            // Animate to top
            $("html, body").animate({ scrollTop: 100 }, "slow");

            // Show success message
            $(".purchase-message")
              .show()
              .animate({ opacity: "1" }, "slow");

            setTimeout(() => {
              $(".purchase-message").animate({ opacity: "0" }, "slow");
            }, 3000);
          }
          // Bootstrap validate form
          Private.DOM.form.classList.add("was-validated");
        });
      }
    },
    Methods: {}
  };
  let Public = {
    init: function() {
      Private.Events.tableFill();
      Private.Events.postTable();
    }
  };

  return Public;
})();

Checkout.init();
