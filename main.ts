//% color="#6167d5" weight=10 icon="\uf108" block="DotMatrix"
namespace DotMatrix {

    let MAX7219_REG_DECODEMODE = 0x9
    let MAX7219_REG_INTENSITY = 0xA
    let MAX7219_REG_SCANLIMIT = 0xB
    let MAX7219_REG_SHUTDOWN = 0xC
    let MAX7219_REG_DISPLAYTEST = 0xF

    let MAX7219_PIN_CS = DigitalPin.P1

    //% group="8X8点阵屏" weight=80
    //% block="Initialize MAX7219 |CS:%cs |MOSI:%mosi |SCK:%sck"
    //% cs.defl=DigitalPin.P1 mosi.defl=DigitalPin.P2 sck.defl=DigitalPin.P0
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

    //% group="8X8点阵屏" weight=70
    //% block="Clear all LEDs"
    export function ClearAll() {
        for (let i = 1; i <= 8; i++)
            WriteRegister(i, 0)
    }

    //% group="8X8点阵屏" weight=70
    //% block="Light all LEDs"
    export function LightAll() {
        for (let i = 1; i <= 8; i++)
            WriteRegister(i, 0xFF)
    }

    //% group="8X8点阵屏" weight=70
    //% block="Show dot X %x| Y %y"
    //% x.min=1 x.max=8
    //% y.min=1 y.max=8
    export function Showdot(x: number, y: number) {
        let data = 0x80 >> (y - 1)
        WriteRegister(x, data)
    }

}
