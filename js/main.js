// 1.初始化 speechSynthesis API
const synth = window.speechSynthesis

// 2. 获取节点
const body = document.body
const textForm = document.querySelector('form')
const textInput = document.querySelector('#text-input')
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('#rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('#pitch-value')

// 3.创建语言的数组,接收可供选择的语言的值
let voices = [];

// 通过一个函数来得到API提供的语言列表
const getVoices = () => {
    voices = synth.getVoices()
    // console.log(voices)
    // 遍历这个数组,创建option的标签
    voices.forEach(voice => {
        const option = document.createElement('option')
        // 设置option的内容
        option.textContent = voice.name + '(' + voice.lang + ')'
        // 设置option的属性
        option.setAttribute('data-name', voice.name)
        option.setAttribute('data-lang', voice.lang)
        // 将option标签插入到下拉框中
        voiceSelect.appendChild(option)
    })
}
getVoices()
// 因为是异步执行,所以需等待
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices
}

// 4.说话
const speak = () => {
    // 验证是否在说话
    if (synth.speaking) {
        console.error('正在说话中...')
        return
    }
    // 判断输入框是否有值
    if (textInput.value !== '') {
        // 更换背景图片
        body.style.background = '#141414 url(image/wave.gif)'
        body.style.backgroundRepeat = 'repeat-x'
        body.style.backgroundSize = '100% 100%'
        body.style.backgroundPositionY = '-30px'
        // 获得说话文本
        const speakText = new SpeechSynthesisUtterance(textInput.value)
        
        // 说话结束时触发
        speakText.onend = e => {
            // 结束时关闭背景图片
            body.style.background = '#141414'
            console.log('讲完了')
        }

        // 说话出错时触发
        speakText.onerror = e => {
            console.error('抱歉出错了...')
        }

        // 选择下拉框的语音
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')
        // 遍历voices数组判断是否有选中的语音
        voices.forEach(voice => {
            // 如果有相同的,就发声
            if (voice.name === selectedVoice) {
                speakText.voice = voice
            }
        })

        // 设置音速和音调
        speakText.rate = rate.value
        speakText.pitch = pitch.value

        // 全都设置完成后就可以发声了
        synth.speak(speakText)
    }
}

// 5.事件监听
textForm.addEventListener('submit', e => {
    e.preventDefault()
    speak()
    textInput.blur()
})

rate.addEventListener('change', () => rateValue.textContent = rate.value) 
pitch.addEventListener('change', () => pitchValue.textContent = pitch.value)
voiceSelect.addEventListener('change', () => speak())