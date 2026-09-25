const span = document.getElementById("total-qty-span");

console.log(span.textContent);

try {
  const res = await getTotalItemQty.getTotalItemQty("getTotalItemQty");
  const num = new Number(res);

  span.textContent = num.toLocaleString();
} catch (error) {
  console.log(error);
}
