
script();

let scroll_count=0;

document.addEventListener("scroll", function(){
    scroll_count+=1;
    if(scroll_count%100==1){
        script();
    }
})

function script() {
    let elements = document.querySelectorAll("a");

    for (i = 0; i < elements.length; i++) {
        let current_element = elements[i];
        let current_headline = current_element.querySelector(".headline");
        if (current_headline != null) {
            let current_headline_text = current_headline.innerText;
            if (current_headline_text.split(" ").length <= 4 && current_headline_text.length < 25) {
                let full_article_href = current_element.href;
                if (full_article_href.startsWith("https://www.dagbladet.no/video/") || full_article_href.startsWith("https://www.dagbladet.no/kjop-pluss")) {
                    continue;
                }

                fetch(full_article_href)
                    .then(response => response.text())
                    .then(data => new DOMParser().parseFromString(data, "text/html"))
                    .then(full_html => {

                        let new_title = null;
                        let new_secondary_title = null;

                        try {
                            new_title = full_html.querySelector(".subtitle").innerText;
                        } catch (error) {
                            console.error(error);
                        }

                        try {
                            new_secondary_title = full_html.querySelector("p").innerText;
                        } catch (error) {
                            console.error(error);
                        }

                        console.log(new_title + new_secondary_title)
                        if (new_title != null) {
                            current_headline.outerHTML = "<h3>" + new_title + "</h3>"
                        } else if (new_secondary_title != null) {
                            current_headline.outerHTML = "<h3>" + new_secondary_title + "</h3>"
                        } else {
                            console.log("Removing element..." + current_headline_text)
                            current_element.remove();
                        }
                    


                    }).catch(error => {
                        console.error(error);
                        console.log("Removing element..." + full_article_href)
                        current_element.remove();
                    });

            }


        }
    }
}

