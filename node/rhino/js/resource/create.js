const resourceId = new URLSearchParams(window.location.search).get('resourceId')

const youtubeIframe = `
<iframe width="100%" height="600px" src="https://www.youtube.com/embed/{src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
`

const add = `<div id="content-add" style="width: 40px; height: 40px; position: absolute; left:-50px; border-radius: 5px; background: var(--theme-medium) url(/icons/plus.svg) no-repeat center; background-size: 50%; cursor:pointer;"></div>`
const del = `<div id="content-remove" style="width: 40px; height: 40px; position: absolute; left: 0px; border-radius: 5px; background: var(--theme-medium) url(/icons/trash.png) no-repeat center; background-size: 50%; cursor:pointer;"></div>`
const edit = `<div id="content-edit" style="width: 40px; height: 40px; position: absolute; left: 50px; border-radius: 5px; background: var(--theme-medium) url(/icons/edit.png) no-repeat center; background-size: 50%; cursor:pointer;"></div>`

$.get(
    `/api/resource/get?resourceId=${resourceId}`,
    (data, response) => {
        if (response = 'success') {
            content = JSON.parse(data.resource)
            content.data.forEach((element) => {
                addContent(element)
            })
        }
    }
)

function addContent(element, position)
{
    if (element.type == 'text-heading') {

        let contentElement = $(`<div class="content-item" style="position: relative;"></div>`)
            .hover(
                (e) => {
                    $(contentElement).prepend('<div id=edit></div>')
                    $('#edit').append(
                        $(del).click(()=>{
                            contentElement.remove()
                        })
                    ).append(
                        $(add).click(()=>{
                            addContent({'type':'text-paragraph', 'text':'add text here'}, contentElement)
                        })
                    )
                },
                (e) => {
                    $('#edit').remove()
                })
            .append($(`<div class="text-heading" contenteditable="true">${element.text}</div>`))

        if(position){
            contentElement.insertAfter(position)
            return
        }
        $('#content')
            .append(
                contentElement
            )
    }
    else if (element.type == 'text-paragraph') {

        let contentElement = $(`<div class="content-item" style="position: relative;"></div>`)
            .hover(
                (e) => {
                    $(contentElement).prepend(`<div id=edit></div>`)
                    $('#edit').append(
                        $(del).click(()=>{
                            contentElement.remove()
                        })
                    ).append(
                        $(add).click(()=>{
                            addContent({'type':'text-paragraph', 'text':'add text here'}, contentElement)
                        })
                    )
                },
                (e) => {
                    $('#edit').remove()
                })
            .append($(`<div class="text-paragraph" contenteditable="true">${element.text}</div>`))

        if(position){
            contentElement.insertAfter(position)
            return
        }
        $('#content')
            .append(
                contentElement
            )
    }
    else if (element.type == 'video-youtube') {

        let contentElement = $(`<div class="content-item" style="position: relative;"><div class="video-youtube">${youtubeIframe.replace('{src}', element.id).replace('{height}', '60vh')}</div></div>`)
            .hover(
                (e) => {
                    $(contentElement).prepend(`<div id=edit></div>`)
                    $('#edit').append(
                        $(del).click(()=>{
                            contentElement.remove()
                        })
                    ).append(
                        $(add).click(()=>{
                            addContent({'type':'text-paragraph', 'text':'add text here'}, contentElement)
                        })
                    )
                },
                (e) => {
                    $('#edit').remove()
                })
            .append($(`<div class="text-paragraph" contenteditable="true">${element.text}</div>`))

        if(position){
            contentElement.insertAfter(position)
            return
        }
        $('#content')
            .append(
                contentElement
            )
    }
}

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