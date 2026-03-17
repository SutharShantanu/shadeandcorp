import { Shield, Truck, RotateCcw } from "lucide-react";

interface TrustBadgesProps {
    showFreeShipping?: boolean;
}

export function TrustBadges({ showFreeShipping = false }: TrustBadgesProps) {
    return (
        <div className="grid grid-cols-1 gap-3 text-center">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    100% Secure Payment
                </span>
            </div>
            {showFreeShipping && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        Free Shipping Applied
                    </span>
                </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
                <RotateCcw className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                    Easy 30-Day Returns
                </span>
            </div>
        </div>
    );
}
