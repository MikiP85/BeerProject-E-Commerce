let App = (function() {
  let Private = {
    State: {
      options: {
        listView: false
      },
      data: {
        items: [],
        alert:
          "No data available, please try with different search parameters.",
        cart: [],
        totalPrice: 0,
        quantity: 0
      },

      params: {
        page: 1,
        per_page: 9,
        beer_name: null,
        abv_gt: null,
        abv_lt: null,
        brewed_before: null,
        brewed_after: null,
        food: null
      }
    },
    DOM: {
      ul: document.querySelector(".products__list"),

      templateTile: document.getElementById("items-template-tile"),
      templateList: document.getElementById("items-template-list"),
      templateModal: document.getElementById("template-modal"),
      templateAlert: document.getElementById("no-data-alert"),
      templateCartItem: document.getElementById("template-cart-item"),

      tileBtn: document.querySelector(".tile-view"),
      listBtn: document.querySelector(".list-view"),

      nameInput: document.querySelector("#name"),
      alcRange: document.getElementById("amount"),

      brewedBefore: document.getElementById("brewed-before"),
      brewedAfter: document.getElementById("brewed-after"),

      food: document.querySelectorAll("ul.food li"),

      clearAll: document.getElementById("clear-all"),

      modal: document.getElementById("modal"),

      burger: document.getElementById("burger"),

      cart: document.querySelector(".cart"),
      removeFromCartBtns: document.querySelectorAll("#remove"),
      addToCartBtns: document.querySelectorAll(".btn__add-to-cart"),

      subtotal: document.getElementById("subtotal"),

      templateCheckout: document.getElementById("template-checkout"),
      checkout: document.querySelector(".checkout")
    },
    Events: {
      modalAddToCart: function() {
        Private.DOM.modal.addEventListener("click", function(e) {
          if (e.target.classList.contains("trigger")) {
            let id = parseInt(e.target.dataset.id);

            axios
              .get(`https://api.punkapi.com/v2/beers/${id}`)
              .then(response => {
                let beer = response.data[0];

                let found = false;

                // Find if item is in the cart already
                Private.State.data.cart.forEach(item => {
                  if (item.id === beer.id) {
                    found = true;
                  }
                });

                // If it is in cart, add 1 to quantity
                if (found) {
                  Private.State.data.cart.forEach(item => {
                    if (item.id === beer.id) {
                      item.quantity += 1;
                    }
                  });
                } else {
                  // If its not in cart, add quantity and push to cart
                  beer.quantity = 1;
                  Private.State.data.cart.push(beer);
                }

                // Add to local storage
                localStorage.setItem(
                  "items",
                  JSON.stringify(Private.State.data.cart)
                );

                // Sum total price and add to UI
                Private.Methods.updateCartTotal();

                // Re-render cart and checkout if there is something in LS
                if (localStorage.getItem("items") !== null) {
                  // Add to cart from LS
                  Private.State.data.cart = JSON.parse(
                    localStorage.getItem("items")
                  );

                  // Show checkout in UI
                  $(".checkout").show();

                  // Hide empty cart message
                  $(".empty-cart").hide();

                  // Render cart
                  Private.DOM.cart.innerHTML = Handlebars.compile(
                    Private.DOM.templateCartItem.innerHTML
                  )(Private.State.data);
                  // Render checkout
                  Private.DOM.checkout.innerHTML = Handlebars.compile(
                    Private.DOM.templateCheckout.innerHTML
                  )(Private.State.data);
                }
              });

            document.querySelector(".modal-wrapper").classList.toggle("open");
            document.querySelector(".page-wrapper").classList.toggle("blur-it");
            document.querySelector("body").classList.toggle("scroll");
            modal.innerHTML = "";
          }
        });
      },
      inputOnChange: function() {
        Private.DOM.cart.addEventListener("change", function(e) {
          if (e.target.id === "quantity") {
            let value = parseInt(e.target.value);
            let id = parseInt(e.target.dataset.id);

            // console.log(id);
            // console.log(value);

            Private.State.data.cart.forEach(item => {
              if (item.id === id) {
                item.quantity = value;
              }
            });

            localStorage.setItem(
              "items",
              JSON.stringify(Private.State.data.cart)
            );

            Private.Methods.updateCartTotal();

            // Render cart
            Private.DOM.cart.innerHTML = Handlebars.compile(
              Private.DOM.templateCartItem.innerHTML
            )(Private.State.data);
          }
        });
      },
      addToCart: function() {
        Private.DOM.ul.addEventListener("click", function(e) {
          if (
            e.target.classList.contains("btn__add-to-cart") ||
            e.target.classList.contains("btn__add-to-cart-list")
          ) {
            // Get ID of clicked item
            let id = parseInt(e.target.dataset.id);

            axios
              .get(`https://api.punkapi.com/v2/beers/${id}`)
              .then(response => {
                let beer = response.data[0];

                let found = false;

                // Find if item is in the cart already
                Private.State.data.cart.forEach(item => {
                  if (item.id === beer.id) {
                    found = true;
                  }
                });

                // If it is in cart, add 1 to quantity
                if (found) {
                  Private.State.data.cart.forEach(item => {
                    if (item.id === beer.id) {
                      item.quantity += 1;
                    }
                  });
                } else {
                  // If its not in cart, add quantity and push to cart
                  beer.quantity = 1;
                  Private.State.data.cart.push(beer);
                }

                // Add to local storage
                localStorage.setItem(
                  "items",
                  JSON.stringify(Private.State.data.cart)
                );

                // Sum total price and add to UI
                Private.Methods.updateCartTotal();

                Private.Methods.reRenderCart();
              });

            // Add scroll to cart
            Private.Events.addScrollToCart();
          }
        });
      },
      addScrollToCart: function() {
        // Add scroll to cart
        if (Private.State.data.cart.length >= 4) {
          Private.DOM.cart.classList.add("cart-scroll");
        }
      },
      removeFromCart: function() {
        Private.DOM.cart.addEventListener("click", e => {
          if (e.target.classList.contains("fa-times")) {
            // Remove item from State Cart arr
            Private.State.data.cart.forEach((item, index) => {
              if (item.id == e.target.dataset.id) {
                // Subtract item price from total
                Private.State.data.totalPrice -=
                  Math.ceil(item.attenuation_level) * item.quantity;

                // Add new total to UI
                $("#checkout").text(`${Private.State.data.totalPrice}`);

                // Remove Item from cart
                Private.State.data.cart.splice(index, 1);
              }
            });

            // Remove from Local Storage
            localStorage.setItem(
              "items",
              JSON.stringify(Private.State.data.cart)
            );

            // Check if cart is empty
            if (Private.State.data.cart.length === 0) {
              // Clear LS
              localStorage.clear();

              setTimeout(() => {
                // Show empty cart message
                $(".empty-cart").show();
              }, 1500);

              // Hide checkout in UI
              $(".checkout").hide();

              // Remove item from UI
              this.removeItemUI(e);

              // Render checkout
              Private.DOM.checkout.innerHTML = Handlebars.compile(
                Private.DOM.templateCheckout.innerHTML
              )(Private.State.data);
            } else {
              // If cart is not empty
              this.removeItemUI(e);

              // Sum total price and add to UI
              Private.Methods.updateCartTotal();

              // Re-Render checkout
              Private.DOM.checkout.innerHTML = Handlebars.compile(
                Private.DOM.templateCheckout.innerHTML
              )(Private.State.data);
            }

            // Remove scroll to cart
            if (Private.State.data.cart.length <= 4) {
              Private.DOM.cart.classList.remove("cart-scroll");
            }
          }
        });
      },
      removeItemUI: function(e) {
        e.target.parentElement.parentElement.classList.add("overlay");

        e.target.parentElement.parentElement.classList.add("overlay-spinner");

        setTimeout(() => {
          e.target.parentElement.parentElement.classList.add("overlay-hidden");
        }, 1000);
        setTimeout(() => {
          e.target.parentElement.parentElement.remove();
        }, 1500);
      },
      initPagination: function() {
        var defaultOpts = {
          totalPages: 37,
          visiblePages: 5,
          startPage: 1,
          next: ">",
          prev: "<",
          first: "<<",
          last: ">>",
          initiateStartPageClick: false,
          hideOnlyOnePage: true,
          onPageClick: function(event, page) {
            Private.State.params.page = page;

            if (!Private.State.options.listView) {
              Private.Methods.render();
            } else {
              Private.Methods.listViewRender();
            }
          }
        };
        var $pagination = $("#pagination");
        $pagination.twbsPagination(defaultOpts);
      },
      sortByAlcoholRange: function() {
        $("#slider-range").slider({
          range: true,
          min: 0,
          max: 50,
          values: [0, 50],
          change: function(event, ui) {
            $("#amount").val(ui.values[0] + "%" + " - " + ui.values[1] + "%");

            Private.Methods.sortByAlcohol();
          }
        });

        $("#amount").val(
          $("#slider-range").slider("values", 0) +
            "%" +
            " - " +
            $("#slider-range").slider("values", 1) +
            "%"
        );

        $(".ui-slider-handle").css({
          "background-color": "#bf431f",
          outline: "none"
        });
      },
      listBtnOnClick: function() {
        Private.DOM.listBtn.addEventListener("click", function() {
          Private.Methods.listViewRender();
        });
        Private.State.options.listView = true;
      },
      tileBtnOnClick: function() {
        Private.DOM.tileBtn.addEventListener("click", function() {
          Private.Methods.render();
        });
        Private.State.options.listView = false;
      },
      nameInput: function() {
        Private.DOM.nameInput.addEventListener("keyup", e => {
          const userText = e.target.value;

          if (userText != "") {
            Private.State.params.beer_name = userText;
          } else {
            Private.State.params.beer_name = null;
          }

          if (!Private.State.options.listView) {
            Private.Methods.render();
          } else {
            Private.Methods.listViewRender();
          }
        });
      },

      dateInputBefore: function() {
        Private.DOM.brewedBefore.addEventListener("change", function() {
          let before = new Date(Private.DOM.brewedBefore.value);

          let monthBefore = String(before.getUTCMonth() + 1);
          let yearBefore = String(before.getUTCFullYear());

          let dateBefore = `${monthBefore}-${yearBefore}`;

          if (dateBefore != "NaN-NaN") {
            Private.State.params.brewed_before = dateBefore;
          } else {
            Private.State.params.brewed_before = null;
          }
          if (!Private.State.options.listView) {
            Private.Methods.render();
          } else {
            Private.Methods.listViewRender();
          }
        });
      },
      dateInputAfter: function() {
        Private.DOM.brewedAfter.addEventListener("change", function() {
          let after = new Date(Private.DOM.brewedAfter.value);
          let monthAfter = String(after.getUTCMonth() + 1);
          let yearAfter = String(after.getUTCFullYear());

          let dateAfter = `${monthAfter}-${yearAfter}`;

          if (dateAfter != "NaN-NaN") {
            Private.State.params.brewed_after = dateAfter;
          } else {
            Private.State.params.brewed_after = null;
          }
          if (!Private.State.options.listView) {
            Private.Methods.render();
          } else {
            Private.Methods.listViewRender();
          }
        });
      },
      pickFood: function() {
        Private.DOM.food.forEach(item =>
          item.addEventListener("click", function(e) {
            // console.log(e.target);

            if (e.target.classList.contains("picker")) {
              Private.State.params.food = this.children[0].defaultValue;
              Private.State.params.page = 1;

              if (!Private.State.options.listView) {
                Private.Methods.render();
              } else {
                Private.Methods.listViewRender();
              }
            }
          })
        );
      },
      modalOpenEvent: function() {
        Private.DOM.ul.addEventListener("click", function(e) {
          // Check if clicked element contains class

          if (
            e.target.parentElement.classList.contains("product__img") ||
            e.target.parentElement.classList.contains("product__img-list")
          ) {
            // Get ID of clicked element and set it to axiosParams

            let id = e.target.parentElement.dataset.id;

            axios
              .get(`https://api.punkapi.com/v2/beers/${id}`)
              .then(response => {
                Private.State.data.items = response.data;
                Private.DOM.modal.innerHTML = Handlebars.compile(
                  Private.DOM.templateModal.innerHTML
                )(Private.State.data);
              });

            // Show modal
            document.querySelector(".modal-wrapper").classList.toggle("open");
            document.querySelector(".page-wrapper").classList.toggle("blur-it");
            document.querySelector("body").classList.toggle("scroll");
          }
        });
      },
      modalCloseEvent: function() {
        Private.DOM.modal.addEventListener("click", function(e) {
          if (
            e.target.classList.contains("modal-wrapper") ||
            e.target.classList.contains("fa")
          ) {
            document.querySelector(".modal-wrapper").classList.toggle("open");
            document.querySelector(".page-wrapper").classList.toggle("blur-it");
            document.querySelector("body").classList.toggle("scroll");
            modal.innerHTML = "";
          }
        });
      },
      burgerClick: function() {
        Private.DOM.burger.addEventListener("click", function() {
          this.classList.toggle("open");
        });
      },
      clearAll: function() {
        Private.DOM.clearAll.addEventListener("click", function() {
          // Set params to default
          Private.State.params = {
            page: 1,
            per_page: 9,
            beer_name: null,
            abv_gt: null,
            abv_lt: null,
            brewed_before: null,
            brewed_after: null,
            food: null
          };

          // Restore input fields
          Private.DOM.nameInput.value = "";
          Private.DOM.alcRange.value = "";
          Private.DOM.brewedBefore.value = "";
          Private.DOM.brewedAfter.value = "";
          // Set checkboxex to uncheckd
          Private.DOM.food.forEach(item => {
            item.children[0].checked = false;
          });

          // Restore pagination to page 1
          $("#pagination").twbsPagination("destroy");
          Private.Events.initPagination();

          // Clear slider
          $("#slider-range").slider({
            range: true,
            min: 0,
            max: 50,
            values: [0, 50]
          });
          $("#amount").val(
            $("#slider-range").slider("values", 0) +
              "%" +
              " - " +
              $("#slider-range").slider("values", 1) +
              "%"
          );

          if (!Private.State.options.listView) {
            Private.Methods.render();
          } else {
            Private.Methods.listViewRender();
          }
        });
      }
    },
    Methods: {
      reRenderCart: function() {
        if (localStorage.getItem("items") !== null) {
          // Add to cart from LS
          Private.State.data.cart = JSON.parse(localStorage.getItem("items"));

          // Show checkout in UI
          $(".checkout").show();

          // Hide empty cart message
          $(".empty-cart").hide();

          // Render cart
          Private.DOM.cart.innerHTML = Handlebars.compile(
            Private.DOM.templateCartItem.innerHTML
          )(Private.State.data);
          // Render checkout
          Private.DOM.checkout.innerHTML = Handlebars.compile(
            Private.DOM.templateCheckout.innerHTML
          )(Private.State.data);
        }
      },
      getItems: function() {
        document.querySelector("#spinner").className = "";

        let data = axios
          .get(`https://api.punkapi.com/v2/beers`, {
            params: Private.State.params
          })
          .then(response => {
            document.querySelector("#spinner").className = "hidden-spinner";
            let res = response.data;
            return res;
          })
          .catch(error => {
            Private.DOM.ul.innerHTML =
              "<h4>Unexpected error has occurred!</h4>";
          });

        return data;
      },
      renderCart: function() {
        // Get items from local storage
        if (localStorage.getItem("items") !== null) {
          Private.State.data.cart = JSON.parse(localStorage.getItem("items"));

          // Render cart
          Private.DOM.cart.innerHTML = Handlebars.compile(
            Private.DOM.templateCartItem.innerHTML
          )(Private.State.data);

          // Render checkout
          Private.DOM.checkout.innerHTML = Handlebars.compile(
            Private.DOM.templateCheckout.innerHTML
          )(Private.State.data);
        }
      },
      updateCartTotal: function() {
        let total = 0;
        Private.State.data.cart.forEach(
          item => (total += Math.ceil(item.attenuation_level) * item.quantity)
        );
        Private.State.data.totalPrice = total;

        $("#subtotal").text(`${Private.State.data.totalPrice}`);
      },
      render: function() {
        this.getItems().then(data => {
          Private.State.data.items = data;
          // check if there is data after filtering
          if (data.length == 0) {
            //   // Alert error to user
            Private.DOM.ul.innerHTML = Handlebars.compile(
              Private.DOM.templateAlert.innerHTML
            )(Private.State.data);
          } else {
            Private.DOM.ul.innerHTML = Handlebars.compile(
              Private.DOM.templateTile.innerHTML
            )(Private.State.data);
          }
        });
        Private.State.options.listView = false;
      },
      listViewRender: function() {
        this.getItems().then(data => {
          Private.State.data.items = data;

          if (data.length == 0) {
            Private.DOM.ul.innerHTML = Handlebars.compile(
              Private.DOM.templateAlert.innerHTML
            )(Private.State.data);
          } else {
            Private.DOM.ul.innerHTML = Handlebars.compile(
              Private.DOM.templateList.innerHTML
            )(Private.State.data);
          }
        });
        Private.State.options.listView = true;
      },
      sortByAlcohol: function() {
        const alcohol = Private.DOM.alcRange.value.split(" - ").map(value => {
          let number = parseInt(value.replace(/[^a-zA-Z0-9 ]/g, ""));
          return number;
        });
        let [alcMin, alcMax] = alcohol;
        Private.State.params.abv_gt = alcMin;
        Private.State.params.abv_lt = alcMax;

        if (!Private.State.options.listView) {
          Private.Methods.render();
        } else {
          Private.Methods.listViewRender();
        }
      }
    }
  };

  // ============================
  // Public
  // ============================
  let Public = {
    init: function() {
      Private.Methods.render();
      Private.Methods.renderCart();
      Private.Methods.updateCartTotal();
      Private.Methods.reRenderCart();

      Private.Events.addScrollToCart();
      Private.Events.burgerClick();
      Private.Events.initPagination();
      Private.Events.nameInput();
      Private.Events.sortByAlcoholRange();
      Private.Events.listBtnOnClick();
      Private.Events.tileBtnOnClick();
      Private.Events.dateInputBefore();
      Private.Events.dateInputAfter();
      Private.Events.pickFood();
      Private.Events.clearAll();
      Private.Events.modalOpenEvent();
      Private.Events.modalCloseEvent();
      Private.Events.addToCart();
      Private.Events.removeFromCart();
      Private.Events.inputOnChange();
      Private.Events.modalAddToCart();
    }
  };
  return Public;
})();

App.init();
