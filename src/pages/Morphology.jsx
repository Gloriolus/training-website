function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-success">Зовнішній вигляд</h3>
          <p>Зайці - це маленькі тварини з м'яким пухнастим хутром, яке може бути різного кольору. Вони мають довгі вуха, великі очі та короткий хвіст.</p>
        </section>
        <section>
          <h3 className="h3 text-success">Особливості будови</h3>
          <ul>
            <li>Довжина тіла 55—70 см, довжина клиноподібного хвоста 8—12 см, вага 4—10 кг.</li>
            <li>Задні ноги в русака набагато довші за передні, ступні вузькі і витягнуті, повністю вкриті шерстю.</li>
            <li>Вуха довгі, ланцетоподібні, пригнуті до голови, заходять далі, ніж кінець морди; по зовнішньому краю вуха йде темна смуга.</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="https://tut-cikavo.com/images/7_new/young-hare.jpg" alt="Зайці на лузі" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Коала в лісі</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;