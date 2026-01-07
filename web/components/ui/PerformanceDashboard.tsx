/**
 * Performance Dashboard for monitoring pagination and infinite scroll performance
 * Requirements: 1.1 - Performance monitoring and benchmarks
 */

'use client';

import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '../../lib/performanceMonitor';

interface PerformanceDashboardProps {
    isVisible?: boolean;
    onToggle?: () => void;
}

export default function PerformanceDashboard({
    isVisible = false,
    onToggle
}: PerformanceDashboardProps) {
    const [stats, setStats] = useState(performanceMonitor.getStats());
    const [thresholds, setThresholds] = useState(performanceMonitor.checkPerformanceThresholds());
    const [recentMetrics, setRecentMetrics] = useState(performanceMonitor.getRecentMetrics(5));

    // Update stats every 2 seconds when visible
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setStats(performanceMonitor.getStats());
            setThresholds(performanceMonitor.checkPerformanceThresholds());
            setRecentMetrics(performanceMonitor.getRecentMetrics(5));
        }, 2000);

        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-blue-700 transition-colors z-50"
                title="Show Performance Dashboard"
            >
                📊 Performance
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
                <button
                    onClick={onToggle}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                    title="Hide Dashboard"
                >
                    ×
                </button>
            </div>

            {/* Performance Summary */}
            <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>Total Operations:</span>
                            <span className="font-mono">{stats.totalOperations}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Avg Load Time:</span>
                            <span className="font-mono">{stats.averageLoadTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Memory Trend:</span>
                            <span className={`font-mono ${stats.memoryTrend === 'stable' ? 'text-green-600' :
                                    stats.memoryTrend === 'increasing' ? 'text-red-600' :
                                        stats.memoryTrend === 'decreasing' ? 'text-blue-600' :
                                            'text-gray-600'
                                }`}>
                                {stats.memoryTrend}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Performance Thresholds */}
                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Thresholds</h4>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between items-center">
                            <span>Initial Load (&lt;2s):</span>
                            <span className={`font-mono ${thresholds.initialLoadOk ? 'text-green-600' : 'text-red-600'}`}>
                                {thresholds.initialLoadOk ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Subsequent (&lt;500ms):</span>
                            <span className={`font-mono ${thresholds.subsequentLoadOk ? 'text-green-600' : 'text-red-600'}`}>
                                {thresholds.subsequentLoadOk ? '✓' : '✗'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Memory Stable:</span>
                            <span className={`font-mono ${thresholds.memoryStable ? 'text-green-600' : 'text-red-600'}`}>
                                {thresholds.memoryStable ? '✓' : '✗'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Warnings */}
                {thresholds.warnings.length > 0 && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded">
                        <h4 className="font-medium text-red-900 mb-2">Warnings</h4>
                        <ul className="text-sm text-red-800 space-y-1">
                            {thresholds.warnings.map((warning, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-red-600 mr-1">⚠</span>
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recent Operations */}
                <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Operations</h4>
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                        {recentMetrics.length === 0 ? (
                            <p className="text-gray-500">No operations recorded</p>
                        ) : (
                            recentMetrics.map((metric, index) => (
                                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                    <span className="truncate mr-2">{metric.operation}</span>
                                    <span className={`font-mono ${metric.duration > 2000 ? 'text-red-600' :
                                            metric.duration > 500 ? 'text-yellow-600' :
                                                'text-green-600'
                                        }`}>
                                        {metric.duration.toFixed(0)}ms
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Performance Extremes */}
                {stats.slowestOperation && stats.fastestOperation && (
                    <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-900 mb-2">Extremes</h4>
                        <div className="text-xs space-y-1">
                            <div>
                                <span className="text-red-600">Slowest:</span>
                                <span className="ml-1 font-mono">{stats.slowestOperation.duration.toFixed(0)}ms</span>
                                <span className="ml-1 text-gray-500">({stats.slowestOperation.operation})</span>
                            </div>
                            <div>
                                <span className="text-green-600">Fastest:</span>
                                <span className="ml-1 font-mono">{stats.fastestOperation.duration.toFixed(0)}ms</span>
                                <span className="ml-1 text-gray-500">({stats.fastestOperation.operation})</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            performanceMonitor.clear();
                            setStats(performanceMonitor.getStats());
                            setThresholds(performanceMonitor.checkPerformanceThresholds());
                            setRecentMetrics([]);
                        }}
                        className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                        Clear Data
                    </button>
                    <button
                        onClick={() => {
                            const data = {
                                stats,
                                thresholds,
                                recentMetrics,
                                timestamp: new Date().toISOString()
                            };
                            console.log('Performance Report:', data);
                            navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
                        }}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}