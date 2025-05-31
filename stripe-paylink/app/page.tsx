"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
// Removed Ban from lucide-react as it's replaced by an image
import { Phone, Check, Loader2, Plus, Copy, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentPage() {
  const [step, setStep] = useState<"phone" | "verification" | "success">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [promoCode, setPromoCode] = useState("")
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "link">("direct")
  const [linkCopied, setLinkCopied] = useState(false)

  const paymentLink = "https://pay.0w2.com/beauty-essentials-kit-65"

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const unitPrice = 65.0
  const subtotal = unitPrice * quantity
  const discount = promoCode.trim() ? 0 : 0
  const totalDue = subtotal - discount

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("verification")
    setVerificationCode(["", "", "", "", "", ""])
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus()
      }
    }, 100)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep("success")
    }, 4000)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newVerificationCode = [...verificationCode]
    newVerificationCode[index] = value
    setVerificationCode(newVerificationCode)
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const isOtpComplete = verificationCode.every((digit) => digit !== "")

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border-2 border-black">
        {/* Product Information - Left Side */}
        <div className="w-full md:w-2/5 bg-[#252525] p-3 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-5 h-5 flex items-center justify-center mr-2">
                <Image src="/0w2-logo-gradient.png" alt="0W2 Logo" width={20} height={20} className="w-5 h-5" />
              </div>
              <h2 className="text-base font-medium">OW2</h2>
            </div>

            <div className="mb-2">
              <h1 className="text-lg font-bold mb-0.5">Beauty Essentials Kit</h1>
              <div className="text-xl font-bold mb-0.5">${unitPrice.toFixed(2)}</div>
              <div className="text-xs opacity-80">Premium skincare collection</div>
            </div>

            <div className="bg-product-image-bg rounded-lg mb-2 relative h-52 overflow-hidden">
              <Image
                src="/product-image.jpg"
                alt="Beauty Products Kit"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 40vw"
              />
            </div>
          </div>

          <div className="text-xs opacity-70">
            <div className="flex items-center justify-between mb-1">
              <span>Secure payment powered by</span>
              <span className="font-medium">stripe</span>
            </div>
            <div className="flex space-x-3">
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </div>
        </div>

        {/* Payment Form - Right Side */}
        <div className="w-full md:w-3/5 p-4 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-center space-x-2 mb-2">
              <button
                className="w-full max-w-[180px] bg-black text-white py-2 px-4 rounded-md flex items-center justify-center"
                onClick={() => {
                  setPaymentMethod("direct")
                  setStep("phone")
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                </svg>
                Pay direct
              </button>
              <button
                className="w-full max-w-[180px] bg-[#00b341] text-white py-2 px-4 rounded-md flex items-center justify-center"
                onClick={() => setPaymentMethod("link")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 mr-2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Pay with link
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="px-2 text-xs text-gray-500">Or pay another way</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>
          </div>

          {paymentMethod === "direct" && step === "phone" && (
            <div className="flex flex-col mt-0">
              <div className="mb-3 border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium">Beauty Essentials Kit</div>
                    <div className="text-sm text-gray-500">Niacinamide + zinc serum</div>
                  </div>
                  <div className="font-medium">${unitPrice.toFixed(2)}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Qty</span>
                    <Select value={quantity.toString()} onValueChange={(value) => setQuantity(Number.parseInt(value))}>
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="flex items-center text-sm text-gray-500 bg-gray-100 w-full p-2 rounded"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add promotion code
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => setPromoCode("")} className="h-9">
                      Apply
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total due</span>
                  <span className="font-medium">${totalDue.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmitPhone} className="space-y-3">
                <div>
                  <Label htmlFor="phone" className="text-sm mb-1 block">
                    Phone number
                  </Label>
                  <div className="flex">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[80px] rounded-r-none h-9">
                        <SelectValue placeholder="+1" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+91">+91</SelectItem>
                        <SelectItem value="+234">+234</SelectItem>
                        <SelectItem value="+86">+86</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="flex-1 rounded-l-none h-9"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-black/90 text-white h-9">
                  <Phone className="mr-2 h-4 w-4" /> Pay ${totalDue.toFixed(2)}
                </Button>
              </form>
            </div>
          )}

          {paymentMethod === "direct" && step === "verification" && (
            <div className="flex flex-col items-center justify-center h-full py-6">
              <h2 className="text-xl font-bold mb-2 text-center">Verification Code</h2>
              <p className="text-gray-500 text-sm mb-4 text-center">Enter the 6-digit code sent to WhatsApp</p>

              <form onSubmit={handleVerifyCode} className="w-full max-w-md space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  {[0, 1, 2].map((index) => (
                    <Input
                      key={`otp-${index}`}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 text-center text-lg font-bold"
                      value={verificationCode[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                  <span className="text-lg font-bold mx-1">-</span>
                  {[3, 4, 5].map((index) => (
                    <Input
                      key={`otp-${index}`}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-10 h-10 text-center text-lg font-bold"
                      value={verificationCode[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-black/90 text-white h-9 mt-4"
                  disabled={isLoading || !isOtpComplete}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Confirm Payment"
                  )}
                </Button>
              </form>
            </div>
          )}

          {paymentMethod === "direct" && step === "success" && (
            <div className="flex flex-col items-center text-center py-2 mt-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-1">Payment Successful!</h2>
              <p className="text-gray-500 text-sm mb-3">Thank you for your purchase.</p>
              <div className="border border-gray-200 rounded-lg p-3 mb-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-medium">0W-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">${totalDue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment method:</span>
                  <span className="font-medium">WhatsApp Pay</span>
                </div>
              </div>
              <Button onClick={() => setStep("phone")} variant="outline" className="w-full h-9 text-sm">
                Return to store
              </Button>
            </div>
          )}

          {/* Pay with Link Form - Simplified with QR code */}
          {paymentMethod === "link" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full max-w-[320px] bg-white rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col items-center">
                  <div className="text-center mb-6">
                    <div className="text-[#0a2540] text-4xl font-bold">$65.00</div>
                  </div>

                  <div className="bg-white p-2 border border-gray-200 rounded-lg mb-6">
                    <QrCode size={180} className="text-black" />
                  </div>

                  <div className="w-full flex items-center mb-6">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm text-gray-700 bg-gray-50"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md p-2 text-gray-600 hover:bg-gray-200"
                    >
                      {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>

                  <button className="w-full bg-[#0a2540] hover:bg-[#0a2540]/90 text-white py-3 rounded-md font-medium">
                    Confirm Payment
                  </button>
                </div>
                <div className="h-2 bg-[#6366f1] w-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
