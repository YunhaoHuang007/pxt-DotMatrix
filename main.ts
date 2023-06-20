//% color="#6167d5" weight=10 icon="\uf108" block="8x8点阵"
namespace DotMatrix {
    let MAX7219_REG_DECODEMODE = 0x9
    let MAX7219_REG_INTENSITY = 0xA
    let MAX7219_REG_SCANLIMIT = 0xB
    let MAX7219_REG_SHUTDOWN = 0xC
    let MAX7219_REG_DISPLAYTEST = 0xF

    let MAX7219_PIN_CS = DigitalPin.P1

    //% parts="DotMatrix" blockId="InitMAX7219" weight=80
    //% block="初始化 MAX7219 |CS %cs |MOSI %mosi |SCK %sck"
    export function InitMAX7219(cs: DigitalPin, mosi: DigitalPin, sck: DigitalPin) {
        MAX7219_PIN_CS = cs

        pins.spiPins(mosi, DigitalPin.P14, sck)
        pins.spiFormat(8, 3)
        pins.spiFrequency(1000000)

        WriteRegister(MAX7219_REG_SHUTDOWN, 0)
        WriteRegister(MAX7219_REG_DISPLAYTEST, 0)
        WriteRegister(MAX7219_REG_DECODEMODE, 0)
        WriteRegister(MAX7219_REG_SCANLIMIT, 7)
        WriteRegister(MAX7219_REG_INTENSITY, 15)
        WriteRegister(MAX7219_REG_SHUTDOWN, 1)
        ClearAll()
    }

    function WriteRegister(regAddr: number, data: number) {
        pins.digitalWritePin(MAX7219_PIN_CS, 0)
        pins.spiWrite(regAddr)
        pins.spiWrite(data)
        pins.digitalWritePin(MAX7219_PIN_CS, 1)
    }

    //% parts="DotMatrix" blockId="ClearAll" weight=70
    //% block="Clear all LEDs"
    export function ClearAll() {
        for (let i = 1; i <= 8; i++)
            WriteRegister(i, 0)
    }

    //% parts="DotMatrix" blockId="LightAll" weight=70
    //% block="Light all LEDs"
    export function LightAll() {
        for (let i = 1; i <= 8; i++)
            WriteRegister(i, 0xFF)
    }

    //% parts="DotMatrix" blockId="SetBrightness" weight=70
    //% block="Set brightness level %level"
    export function SetBrightness(level: number) {
        WriteRegister(MAX7219_REG_INTENSITY, level)
    }

    //% parts="DotMatrix" blockId="Showdot" weight=70
    //% block="Show dot X %x| Y %y"
    //% x.min=0 x.max=7
    //% y.min=0 y.max=7
    export function Showdot(x: number, y: number) {
        x = x + 1
        let data = 0x80 >> y
        WriteRegister(x, data)
    }

    //% parts="DotMatrix" blockId="ShowCustText" weight=70
    //% block="Show customize array %text"
    export function ShowCustText(text: string) {
        let tempTextArray: string[] = []
        let currentIndex = 0
        let currentChr = ""
        let currentNum = 0
        let columnNum = 0

        if (text != null && text.length >= 0) {
            while (currentIndex < text.length) {
                tempTextArray.push(text.substr(currentIndex + 1, 8))
                currentIndex += 10
            }
            for (let i = 0; i < tempTextArray.length; i++) {
                columnNum = 0
                for (let j = tempTextArray[i].length - 1; j >= 0; j--) {
                    currentChr = tempTextArray[i].substr(j, 1)
                    if (currentChr == "1" || currentChr == "0")
                        currentNum = parseInt(currentChr)
                    else
                        currentNum = 0
                    columnNum += (2 ** (tempTextArray[i].length - j - 1)) * currentNum
                }
                WriteRegister(i + 1, columnNum)
            }
        }
    }
}
