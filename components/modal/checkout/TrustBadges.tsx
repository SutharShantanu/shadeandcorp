import { Shield, Truck, RotateCcw } from "lucide-react";

interface TrustBadgesProps {
    showFreeShipping?: boolean;
}

export function TrustBadges({ showFreeShipping = false }: TrustBadgesProps) {
    return (
        <div className="grid grid-cols-1 gap-3 text-center">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Shield className="w-5 h-5 text-green-600 shrink-0" />
                <span className="text-sm font-medium text-green-700">
                    100% Secure Payment
                </span>
            </div>
            {showFreeShipping && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-blue-700">
                        Free Shipping Applied
                    </span>
                </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <RotateCcw className="w-5 h-5 text-purple-600 shrink-0" />
                <span className="text-sm font-medium text-purple-700">
                    Easy 30-Day Returns
                </span>
            </div>
        </div>
    );
}
