const requestData = async(url) => {
    const response = await fetch(url)
    if (response.status >= 200 && response.status < 300) {
        return response.json()
    } else {
        throw new Error(`An error ocurred while fetching the data, error status code: ${response.status}`)
    }
}