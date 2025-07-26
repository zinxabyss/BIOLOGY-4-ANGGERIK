$(function () {
  $("nav #cart-content .cart-table tr").not(":first").not(":last").remove();
  $("#cart-items").empty();

  $(window).scroll(function () {
    if ($(this).scrollTop() < 50) {
      $("nav").removeClass("site-top-nav");
      $("#back-to-top").fadeOut();
    } else {
      $("nav").addClass("site-top-nav");
      $("#back-to-top").fadeIn();
    }
  });

  $("#shopping-cart").on("click", function (e) {
    e.preventDefault();
    $(this).closest("li").find("#cart-content").first().toggle("blind", "", 500);
  });

  $("#back-to-top").click(function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 1000);
  });

  $(".food-menu-box form").submit(function (e) {
    e.preventDefault();
    const $form = $(this);
    const name  = $form.find("h4").text().trim();
    const price = parseFloat($form.find(".food-price").text().replace("$", "").trim());
    const qty   = parseInt($form.find("input[type='number']").val(), 10);

    if (qty > 0) {
      const total = (price * qty).toFixed(2);
      const img   = $form.find("img").attr("src");
      const rowHtml = `
        <tr>
          <td><img src="${img}" alt="Food"></td>
          <td>${name}</td>
          <td>$ ${price.toFixed(2)}</td>
          <td>${qty}</td>
          <td>$ ${total}</td>
          <td><a href="#" class="btn-delete">&times;</a></td>
        </tr>`;

      $("#cart-items").append(rowHtml);
      $("nav #cart-content .cart-table tr").last().before(rowHtml);

      updateCart();
      $form.find("input[type='number']").val(0);
    }
  });

  $(document).on("click", ".btn-delete", function (e) {
    e.preventDefault();
    const name = $(this).closest("tr").find("td").eq(1).text().trim();
    $("#cart-items tr").filter(function () {
      return $(this).find("td").eq(1).text().trim() === name;
    }).remove();
    $("nav #cart-content .cart-table tr").filter(function () {
      return $(this).find("td").eq(1).text().trim() === name;
    }).remove();
    updateCart();
  });

  function updateCart() {
    let grandTotal = 0;
    let itemCount  = 0;
    let items = [];

    $("#cart-items tr").each(function () {
      const $td = $(this).find("td");
      const name = $td.eq(1).text().trim();
      const price = parseFloat($td.eq(2).text().replace("$", "").trim());
      const qty = parseInt($td.eq(3).text().trim(), 10);

      grandTotal += price * qty;
      itemCount += qty;
      items.push({ name, price, qty });
    });

    $("#cart-total").text("$" + grandTotal.toFixed(2));
    $(".shopping-cart .badge").text(itemCount);
    $("nav #cart-content .cart-table tr:last-child th").eq(1).text("$" + grandTotal.toFixed(2));

    // Save to localStorage
    localStorage.setItem("cartTotal", grandTotal.toFixed(2));
    localStorage.setItem("myCart", JSON.stringify(items));
  }

  updateCart();
});
