import utils from "./utils.js";
import { sortResults } from "./sort.js";

/**
 * constructs and return the p element that is the results header
 * @returns {HTMLParagraphElement}
 */
export const getHeader = (format = undefined) => {
  const p = utils.makeP();
  p.className = "result-header";

  const span1 = utils.makeSpan();
  span1.className = "span1";
  const inner1 = utils.makeSpan();

  if (format === "CdComps") {
    inner1.textContent = "TITLE ID";
  } else if (format === "CdSingles") {
    inner1.textContent = "SINGLE ID";
  } else {
    inner1.textContent = "ID";
  }
  span1.append(inner1);

  if (format === "all") {
    const span2 = utils.makeSpan();
    span2.className = "span2";
    const inner2 = utils.makeSpan();
    inner2.textContent = "ARTIST";
    span2.append(inner2);
    const span3 = utils.makeSpan();
    span3.className = "span3";
    const inner3 = utils.makeSpan();
    inner3.textContent = "TITLE";
    span3.append(inner3);
    const span4 = utils.makeSpan();
    span4.className = "span4";
    const inner4 = utils.makeSpan();
    inner4.textContent = "LOCATION";
    span4.append(inner4);

    p.append(span1, span2, span3, span4);

    return p;
  }

  inner1.addEventListener("click", (e) => {
    if (format) {
      // format will need capital letter
      switch (format) {
        case "CdComps":
          sortResults("title_id", format);
          break;
        case "CdSingles":
          sortResults("single_id", format);
          break;
        default:
          sortResults("id", format);
      }
      // utils[`sort${format}`]("id");
    }
  });
  const span2 = utils.makeSpan();
  span2.className = "span2";
  const inner2 = utils.makeSpan();
  if (format === "CdComps") {
    inner2.textContent = "TITLE";
  } else {
    inner2.textContent = "ARTIST";
  }
  span2.append(inner2);
  inner2.addEventListener("click", (e) => {
    if (format === "CdComps") {
      sortResults("title", format);
    } else if (format) {
      sortResults("artist", format);
    }
  });
  const span3 = utils.makeSpan();
  span3.className = "span3";
  const inner3 = utils.makeSpan();
  if (format === "CdComps") {
    inner3.textContent = "YEAR";
  } else {
    inner3.textContent = "TITLE";
  }
  span3.append(inner3);
  inner3.addEventListener("click", (e) => {
    if (format === "CdComps") {
      sortResults("year", format);
    } else if (format) {
      sortResults("title", format);
    }
  });
  const span4 = utils.makeSpan();
  span4.className = "span4";
  const inner4 = utils.makeSpan();
  inner4.textContent = format === "CdSingles" ? "YEAR" : "LOCATION";
  span4.append(inner4);
  inner4.addEventListener("click", (e) => {
    if (format === "CdSingles") {
      sortResults("year", format);
    } else if (format) {
      sortResults("location", format);
    }
  });

  p.append(span1, span2, span3, span4);

  if (format === "CdSingles") {
    const span5 = utils.makeSpan();
    span5.className = "span5";
    const inner5 = utils.makeSpan();
    inner5.textContent = "CASE TYPE";
    span5.append(inner5);
    inner5.addEventListener("click", (e) => {
      if (format) {
        sortResults("case_type", format);
      }
    });
    p.append(span5);
    p.classList.add("cd-singles");
  }

  return p;
};
