export async function POST(request ){

    //upload file to removebg
    const {image} = request.json()
    console.log(image.image)
    return Response.json({
      success: true,
    });
}