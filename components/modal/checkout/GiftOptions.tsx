import { Gift } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GiftOptionsProps {
    isGift: boolean;
    giftMessage: string;
    onGiftToggle: (isGift: boolean) => void;
    onMessageChange: (message: string) => void;
}

export function GiftOptions({
    isGift,
    giftMessage,
    onGiftToggle,
    onMessageChange,
}: GiftOptionsProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Collapsible open={isGift} onOpenChange={onGiftToggle}>
                <div className="p-4 bg-linear-to-r from-pink-50 dark:from-pink-500/10 to-purple-50 dark:to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="font-semibold text-purple-900 dark:text-purple-300">Make it Special</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">+$5</span>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8">
                                    {isGift ? "Remove" : "Add Gift Wrap"}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                </div>
                <CollapsibleContent>
                    <div className="p-4 border-t space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                            {["🎁", "🎀", "💝"].map((emoji, idx) => (
                                <button
                                    key={idx}
                                    className="p-4 border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-3xl"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                        <div>
                            <Label htmlFor="gift-message" className="text-sm font-medium">
                                Personalized Message
                            </Label>
                            <Input
                                id="gift-message"
                                placeholder="Write your heartfelt message..."
                                value={giftMessage}
                                onChange={(e) => onMessageChange(e.target.value)}
                                maxLength={200}
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-500 mt-1.5">
                                {giftMessage.length}/200 characters
                            </p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
