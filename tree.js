(function( $ ) {
    var settings;
    var currentCard;
    var prevCard = [];
    
    // Plugin definition.
    $.fn.decisionTree = function( options ) {
        var elem = $( this );
        settings = $.extend( {}, $.fn.decisionTree.defaults, options );
        
        elem.addClass(settings.containerClass);
        renderRecursive(settings.data, elem, "dctree-first");
        
        $('.dctree-prev').on('click', function() {
            showCard(prevCard.pop(), true);
        });

        currentCard = $('#dctree-first');
        currentCard.show();
    };
    
    
    $.fn.decisionTree.defaults = {
        data: null,
        animationSpeed: "slow",
        animation: "slide-left",
        containerClass: "dc-tree",
        cardClass: "dctree-card",
        messageClass: "dctree-message"
    };
    
    function renderRecursive(data, elem, id) {
        var container = $('<div></div>')
            .addClass(settings.cardClass)
            .addClass('col-xs-12');
        var message = $('<div></div>').addClass(settings.messageClass).append(data.message);
        container.append(message);
        
        if (id != null) {
            container.attr('id', id)
        }
        
        if (typeof data.decisions != "undefined") {
            var decisions = $('<div></div>').addClass('dctree-decisions');
            for(var i=0; data.decisions.length > i; i++) {
                var decision = data.decisions[i];
                var genId = guid();
                var grid = $('<div></div>').addClass('col-md-6');
                var answer = $('<div></div>')
                    .addClass("dctree-answer-" + i)
                    .append(decision.answer)
                    .on('click', function() {
                        getNextCard(this);
                    })
                    .attr('data-dctree-targetid', genId);
                if (typeof decision.class != "undefined") {
                    answer.addClass(decision.class);
                }
                grid.append(answer);
                decisions.append(grid);
                renderRecursive(decision, elem, genId);
            }
            container.append(decisions);
        }
        
            
        if (id != 'dctree-first') {
            var controls = $('<div></div>').addClass('dctree-controls col-md-12');
            controls.append($('<a href="javascrip:;" class="dctree-prev">< Back</a>'));
            container.append(controls);
        }
        
        elem.append(container);
    }
    
    function getNextCard(elem)
    {
        var e = $(elem);
        currentCard = e.parents('.' + settings.cardClass)[0];
        prevCard.push(currentCard.id);
        var nextCard = e.attr('data-dctree-targetid');    
        showCard(nextCard);
    }
    
    function showCard(id, backward)
    {
        var nextCard = $("#" + id);
        
        if (settings.animation == 'slide') {
            $(currentCard).slideUp(settings.animationSpeed, function(){
                nextCard.slideDown(settings.animationSpeed);
            });
        } else if (settings.animation == 'fade') {
            $(currentCard).fadeOut(settings.animationSpeed, function(){
                nextCard.fadeIn(settings.animationSpeed);
            });
        } else if (settings.animation == 'slide-left') {
            var left = {left: "-100%"};
            var card = $(currentCard);

            if (backward) {
                left = {left: "100%"};
            }
            card.animate(left, settings.animationSpeed, function(){
                card.hide();
            });

            if (nextCard.css('left') == "-100%" || nextCard.css('left') == "100%") {
                left.left = 0;
                nextCard.show().animate(left, settings.animationSpeed);
            } else {
                nextCard.fadeIn(settings.animationSpeed);
            }
        }
        
        currentCard = nextCard;
    }
    
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
 
// End of closure.
 
})( jQuery );

var data = {
    message: "<div style='color:green;'>Are you yourself in a position to put the matter right?</div>",
    decisions: [
            {
                answer: "Yes",
                class: "green",
                message: 'Take appropriate <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11861.asp" target="_blank">action</a> and keep a record of your actions.<br><br>Should the matter also be dealt with through routine local incident reporting arrangements?',
                decisions: [
                    {
                        answer: "Yes",
                        class: "green",
                        message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Report your concern</a> and keep a record of your actions.<br><br>Are you satisfied with the response?',
						decisions: [
							{
								answer: "Yes",
								class: "green",
								message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>',
							},
							{
								answer: "No",
								class: "red",
								message: 'Can you raise your concern with your manager or other responsible person in your organisation?',
								decisions: [
								{
									answer: "Yes",
									class: "green",
									message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Raise your concern with your manager or other responsible person within the organisation</a> and keep a record of your actions.<br><br>Are you satisfied with the response?',
									decisions: [
										{
											answer: "Yes",
											class: "green",
											message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>'
										},
										{
											answer: "No",
											class: "red",
											message: 'Are you a doctor in training?',
											decisions: [
												{
													answer: "Yes",
													class: "green",
													message: "Can you raise your concern with a named person in your deanery?",
													decisions: [
														{
															answer: "Yes",
															class: "green",
															message: 'Raise your concern with the <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">postgraduate dean or the director of postgraduate general practice education</a> and keep a record of your actions.<br><br>Are you satisfied with your response from your deanery?',
															decisions: [
																{
																	answer: "Yes",
																	class: "green",
																	message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>'
																},
																{
																	answer: "No",
																	class: "red",
																	message: "Can you escalate your concerns to a higher level within your organisation or elsewhere locally?",
																	decisions: [
																		{
																			answer: "Yes",
																			class: "green",
																			message: 'Escalate your concern to a higher level within your organisation or elsewhere locally, such as with <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">the medical director or clinical governance lead</a> and keep a record of your actions.<br><br>Are you satisfied that your concerns have been addressed locally?',
																			decisions: [
																				{
																					answer: "Yes",
																					class: "green",
																					message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>'
																				},
																				{
																					answer: "No",
																					class: "red",
																					message: "Can you escalate your concern to a regulator or other external body with responsibility to act or intervene?",
																					decisions: [
																						{
																							answer: "Yes",
																							class: "green",
																							message: 'Raise your concern with the <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">appropriate regulator or other external body</a> and keep a record of your actions.<br><br>Are you satisfied that your concern has been addressed by the appropriate regulator or other external organisation?',
																							decisions: [
																								{
																									answer: "Yes",
																									class: "green",
																									message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>'
																								},
																								{
																							answer: "No",
																							class: "red",
																							message: "Are you considering making your concern public?",
																							decisions: [
																								{
																									answer: "Yes",
																									class: "green",
																									message: 'Before making your concerns public, <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11866.asp" target="_blank">you must understand the legal protections available to you</a> and keep a record of your actions.'
																								},
																								{
																									answer: "No",
																									class: "red",
																									message: 'Seek advice on how to raise your concerns further from:<br>1) Your medical director or other colleague<br>2) Your medical defence body<br>3) The GMC Confidential Helpline 0161 923 6399<br>4) The NHS Whistleblowing Helpline 0800 724 725<br>5) <a href="http://www.pcaw.org.uk/Public" target="_blank"> Concern at Work</a><br>and keep a record of your actions.' 
																								}
																							]
																						}
																							]
																						},
																						{
																							answer: "No",
																							class: "red",
																							message: "Are you considering making your concern public?",
																							decisions: [
																								{
																									answer: "Yes",
																									class: "green",
																									message: 'Before making your concerns public, <a href="https://www.gmc-uk.org/guidance/ethical_guidance/11866.asp" target="_blank">you must understand the legal protections available to you</a> and keep a record of your actions.'
																								},
																								{
																									answer: "No",
																									class: "red",
																									message: 'Seek advice on how to raise your concerns further from:<br>1) Your medical director or other colleague<br>2) Your medical defence body<br>3) The GMC Confidential Helpline 0161 923 6399<br>4) The NHS Whistleblowing Helpline 0800 724 725<br>5) <a href="http://www.pcaw.org.uk/Public" target="_blank"> Concern at Work</a><br>and keep a record of your actions.' 
																								}
																							]
																						}
																					]
																				}
																			]
																		},
																		{
																			answer: "No",
																			class: "red",
																			message: "Can you escalate your concern to a regulator or other external body with responsibility to act or intervene?"
																		}
																	]
																},
															]
														},
														{
															answer: "No",
															class: "red",
															message: "Can you escalate your concerns to a higher level within your organisation or elsewhere locally?"
														}
													]
												},
												{
													answer: "No",
													class: "red",
													message: "Can you escalate your concerns to a higher level within your organisation or elsewhere locally?"
												}
											]

										},
									]
								},
								{
									answer: "No",
									class: "red",
									message: "Test text",
								},
								]
							}
						]
                    },
                    {
                        answer: "No",
                        class: "red",
                        message: '<a href="https://www.gmc-uk.org/guidance/ethical_guidance/11867.asp" target="_blank">Keep a record of your concerns and the actions you have taken to resolve them.</a>'
                    }
                ]
            },
            {
                answer: "No",
                        class: "red",
                message: "You are wrong !"
            },
            {
                answer: "Tell me more about this...",
                class: "orange",
                message: 'This is decision tree has been compiled from the <a href="https://www.gmc-uk.org/interactiveflowchart/documents/Raising_concerns_flowchart.pdf" target="_blank">GMC raising concerns flowchart</a> the idea was born at <a href="http://www.nhshackday.com" target="_blank">NHS Hack Day Cardiff</a> but took some time to finish. It was made by Jon Hilton, if you have comments or questions, get in touch - jjhilton@gmail.com or @JonJHilton on Twitter'
            }
        ]
};

$(document).ready(function() {
    $('.main').decisionTree({data: data});
});