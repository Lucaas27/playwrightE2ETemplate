//Function to replace parameters in a JSON response with values from a data object
export async function replaceParameters(resJson, paramData) {
    paramData.dateTime = new Date().toISOString().replace('Z', '');
    const replacedJson = JSON.parse(JSON.stringify(resJson));

    function traverse(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key]);
            } else if (typeof obj[key] === 'string' && obj[key].startsWith('{') && obj[key].endsWith('}')) {
                const paramKey = obj[key].slice(1, -1);
                if (paramData.hasOwnProperty(paramKey)) {
                    obj[key] = paramData[paramKey];
                }
            }
        }
    }

    traverse(replacedJson);
    return replacedJson;
};

//Mock functions

//Mock responses with no replace parameters
export async function mockResponseWithNoParams(network, endpoint, status, response) {
    await network.waitMockApiResponse(endpoint, status, response);
};

//Mock responses with replace parameters
export async function mockResponseWithParams(network, endpoint, status, response, data) {
    const populatedRes = await replaceParameters(response, data);
    await network.waitMockApiResponse(endpoint, status, populatedRes);
};

//Mock responses with no response body
export async function mockWithParams(network, endpoint, status){
    await network.waitMockApiResponse(endpoint, status);
};