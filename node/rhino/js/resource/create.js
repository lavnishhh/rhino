const resourceId = new URLSearchParams(window.location.search).get('resourceId')

const youtubeIframe = `
<iframe width="100%" height="600px" src="https://www.youtube.com/embed/{src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
`

const editDelete = `
<div style="position: relative; left: 50%; bottom:150%;">
<div style="width: 40px; height: 40px; position: absolute; border-radius: 5px; background: rgb(255, 53, 53) url(/icons/trash.png) no-repeat center; background-size: 50%;"></div>
<div style="width: 40px; height: 40px; position: absolute; left: 50px; border-radius: 5px; background: rgb(102, 255, 46) url(/icons/plus.svg) no-repeat center; background-size: 50%;"></div>
</div>
`

$.get(
    `/api/resource/get?resourceId=${resourceId}`,
    (data, response)=>{
        if(response = 'success'){
            content = JSON.parse(data.resource)
            content.data.forEach((element)=>{
                if(element.type == 'text-heading'){
                    $('#content')
                    .append(

                        //FIX add delete add to content item instead of content text
                        $(`<div class="content-item" style="position: relative;"></div>`)
                        .hover((e)=>{
                            $(e.target).append(editDelete)
                        },
                        (e)=>{
                            $(e.target).find('div:last').remove()
                            $(e.target).find('div:last').remove()
                        })
                        .append(`<div class="text-heading" contenteditable="true">${element.text}</div>`)
                        )
                }
                else if(element.type == 'text-paragraph'){
                    $('#content').append(`<div style="content-item" style="position: relative;"><p class="text-paragraph" contenteditable="true">${element.text}</p></div>`)
                }
                else if(element.type == 'video-youtube'){
                    $('#content').append(`<div style="content-item" style="position: relative;"><div class="video-youtube">${youtubeIframe.replace('{src}', element.id).replace('{height}','60vh')}</div></div>`)
                }
            })
        }
    }
)

// $.get(
//     `/api/resource/get?resourceId=${resourceId}`,
//     (data, response)=>{
//         if(response = 'success'){
//             content = JSON.parse(data.resource)
//             content.data.forEach((element)=>{
//                 if(element.type == 'text-heading'){
//                     $('#content').append(`<a class="text-heading">${element.text}</a>`)
//                 }
//                 else if(element.type == 'text-paragraph'){
//                     $('#content').append(`<p class="text-paragraph">${element.text}</p>`)
//                 }
//                 else if(element.type == 'video-youtube'){
//                     $('#content').append(`<div class="video-youtube">${youtubeIframe.replace('{src}', element.id)}</div>`)
//                 }
//             })
//         }
//     }
// )