$(document).ready(function() {
    var chat = $(".chat");

    function scrollToBottom() {
        chat.scrollTop(chat.prop("scrollHeight"));
    }

    var additem = $(".choice");
    var input = $("<input>").addClass("choice-input").attr("id", "input-value");
    var button = $("<button>").text("search").addClass("choice-btn").attr("id", "load-content-button");
    additem.append(input, button)
    // additem.append(button);

    $("#load-content-button").click(function() {
        var valueToSend = $("#input-value").val();

        chat.append(
            $('<div>').attr("id", 'chat-hu').append(
                $('<div>').attr('id', 'hu-img').append(
                    $('<img>').attr("src", "/static/images/person.png").attr("alt", "사람 이미지").addClass("hu-img")
                    ),
                $('<div>').attr('id', 'hu-content').text(valueToSend)
            )
        )

        var loadingContainer = $("<div>").addClass("loading-container").text("Loading...");
        chat.append(loadingContainer);
        scrollToBottom();
        
        axios.post("/get-status", { value: valueToSend }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(function(response) {
                $(".loading-container").remove();
                var res = response.data
                console.log(res)
                var html = "<tbody>"
                var a = 0
                for (var key in res) {
                    if (key != 'error'){
                        html += "<tr><td>"+key+"</td>"
                        html += "<td>"+res[key]+"</td></tr>"
                        if (key=="학명") {var name = res[key]} 
                        a = 1
                    }
                }
                if (a == 1) {
                    html+="</tbody>"
                    chat.append(
                        $("<div>").attr("id", "chat-bot").append(
                            $('<div>').attr("id", "bot-img").append(
                                $("<img>").attr("src", "/static/images/robot.png").attr("alt", "로봇 이미지").addClass("bot-img")
                            ),
                            $('<div>').attr("id", "bot-content").append(
                                $('<div>').attr("id", "content-img-bot").append(
                                    $('<img>').attr("src", "https://source.unsplash.com/1600x900/?"+name).attr("alt", name).addClass("content-img")
                                ),
                                $('<div>').attr("id", "content-text-bot").html(html)
                            )
                        )
                    )
                } else {
                    chat.append(
                        $("<div>").attr("id", "chat-bot").append(
                            $('<div>').attr("id", "bot-img").append(
                                $("<img>").attr("src", "/static/images/robot.png").attr("alt", "로봇 이미지").addClass("bot-img")
                            ),
                            $('<div>').attr("id", "bot-content").text('다시 입력해 주세요.')
                        )
                    )
                }
                scrollToBottom();
            })
            .catch(function(error) {
                console.log(error);
                $("#loading-container").remove();
            });
    });
});