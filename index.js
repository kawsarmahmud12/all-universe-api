
const sliceButton = document.getElementById('sliceButton');
const soartDataButton = document.getElementById('soartDataButton');
const aiCards = document.getElementById('cardForHtml');
const viewdetailinmodalId = document.getElementById('modal')
let shouldSortData = false;
let shouldSliceData = false;


const loadCard = () => {
    return (`
        <progress class="progress w-full"></progress>
        <progress class="progress w-full"></progress>
        <progress class="progress w-full"></progress>
        <progress class="progress w-full"></progress>
    `)
}


const fetchAICards = async () => {
    const url = 'https://openapi.programming-hero.com/api/ai/tools';

    try {
        aiCards.innerHTML = loadCard();

        const response = await fetch(url);
        const data = await response.json();

        if (isObject(data)) {
            let cards = [];

            if (shouldSortData && shouldSliceData === false) {
                const sortedData = data.data.tools.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
                cards = sortedData.slice(0, 6);
            } else if (shouldSortData === false && shouldSliceData) {
                cards = data.data.tools;
            } else if (shouldSortData && shouldSliceData) {
                const sortedData = data.data.tools.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));
                cards = sortedData;
            } else {
                cards = data.data.tools.slice(0, 6);
            }

            aiCards.innerHTML = cards.map((cardItem) => generateAICard(cardItem)).join('');
        } else {
            console.error('Error fetching AI cards:', data);
        }
    } catch (error) {
        console.log('Error fetching AI cards:', error);
    }
};

const isObject = (obj) => obj instanceof Object;




const generateAICard = (cardItem) => {
    const { name, image, published_in, features, id } = cardItem;

    return (
        `<div class="border rounded-xl p-4 relative shadow-xl">
            <div class="">
                <img class=""
                    src=${image}
                    alt="">
            </div>
            <div class="border-b py-2">
                <h2 class="text-2xl font-semibold pb-2">Features</h2>
                ${features.map((item, i) => (`<p class="text-sm text-gray-600">${i + 1}-${item}</p>`)).join('')}
            </div>
            <div class="flex ">
                <div class="w-48 mr-10">
                    <h2 class="text-xl font-semibold py-2">
                        ${name}
                    </h2>
                    <div class="flex gap-2">
                        <img class="w-5" src="./dateIon.png" alt="">
                        <p>${published_in}</p>
                    </div>
                </div>
                <div class=" items-center">
                    <label onclick="getAiDetails('${id}')" for="my-modal-5" class="rounded-full p-0 bg-white h-auto cursor-pointer">
                        <img class="bg-red-600 p-2 rounded-full" src="./rithtArr.svg" alt="">
                    </label>
                </div>
            </div>
    </div>`
    )

}

const getAiDetails = async (id) => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
        const data = await res.json();
        viewdetailinmodal(data)

    } catch (error) {
        console.log(error)
    }
}


const viewdetailinmodal = (data) => {
    // console.log(data.data.chat.input)
    viewdetailinmodalId.innerHTML = (
        `
        <div class="modal-box w-11/12 max-w-5xl relative overflow-y-visible md:p-10 p-2">
            <div>
                <div class="grid grid-cols-2 gap-3">
                    <div class="md:col-span-1 rounded-xl col-span-2 border border-red-500 p-4 bg-[#eb57570d]">
                    <h2 class="text-3xl font-bold mb-2">${data.data.description}</h2>
                    <div class="flex py-3 gap-4">
                        ${data.data.pricing ? data.data.pricing.map((item, i) => (`
                            <div class="p-5 mb-1.5 text-center ${i === 0 ? 'text-green-500' : i === 1 ? 'text-[#F28927]' : 'text-[#EB5757]'}  text-sm font-bold rounded-lg bg-white">
                                ${item?.price}- ${item?.plan}
                            </div>
                        `)).join('') : `
                            <div class="p-5 mb-1.5 text-center text-green-600 text-sm font-bold rounded-lg bg-white">
                                Free of Cost/Basic
                            </div>
                            <div class="p-5 mb-1.5 text-center  text-yellow-700  text-sm font-bold rounded-lg bg-white">
                                Free Of Cost/Pro
                            </div>
                            <div class="p-5 mb-1.5 text-center text-red-600  text-sm font-bold rounded-lg bg-white">
                                Free of Cost /Enterprise
                            </div>
                        `}
                    </div>
                    <div class="grid grid-cols-2">
                        <div class="md:col-span-1 col-span-2">
                            <h2 class="text-xl font-bold">Features</h2>
                            <ul class="list-disc pl-5 text-gray-600">
                                ${Object.values(data.data.features).map((item, i) => `<li class="">${item.feature_name}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="md:col-span-1 col-span-2">
                            <h2 class="text-xl font-bold">Integrations</h2>
                            ${data.data.integrations ?
            `<ul class="list-disc pl-5 text-gray-600">
                                    ${data.data.integrations.map(integration => `<li class="">${integration}</li>`).join('')}
                                </ul>`
            : "No - data found"
        }
                            
                        </div>
                    </div>
                </div>
                <div class="md:col-span-1 col-span-2 border rounded-xl">
                    <div class=" p-4 relative">
                        <img class="object-contain rounded-xl"
                            src=${data.data.image_link[0]}
                            alt="" />
                        <div class="lg:px-10 px-0">
                        ${data.data.input_output_examples ? data.data.input_output_examples.map(data => (`
                            <div>
                                <div class="text-2xl font-bold text-center py-2">${data.input}</div>
                                <p class="text-base text-center text-gray-600">${data.output}</p>
                            </div>
                        `)) : `
                            <div>
                                <p class="text-2xl font-bold text-center py-2">Can you give any example?</p>
                                <p class="text-base text-center text-gray-600">No! Not Yet! Take a break!!!</p>
                            </div>
                        `}
                            
                        </div>
                        ${data.data.accuracy.score ?
            `<button class="absolute top-7 right-6 bg-red-600 py-1 px-4 rounded-lg text-white font-bold">
                                            ${data.data.accuracy.score} accuracy</button>`
            : ''
        }
                        
                    </div>
                </div>
                </div>
            </div>
            <div class="absolute -top-5 -right-5 modal-action bg-red-500">
                <label for="my-modal-5" class="p-0 bg-red-600 h-auto btn ">
                    <img class="" src="./asdfasdf3452345234523452345.svg" alt="" />
                </label>
            </div>
        </div>
        `
    )
}


sliceButton.addEventListener('click', function () {
    shouldSliceData = true;
    fetchAICards()
});
soartDataButton.addEventListener('click', function () {
    shouldSortData = true;
    fetchAICards()
});

