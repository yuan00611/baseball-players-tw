// components/USA_DotMap.js
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const USA_DotMap = () => {
  const svgRef = useRef(null);
  // 建議稍微調大一點尺寸以獲得更好的解析度
  const [dimensions, setDimensions] = useState({ width: 960, height: 600 });

  const teamLocations = [
    { id: 'dodgers-mlb', name: 'Dodgers (MLB)', level: 'MLB', coords: [-118.24, 34.05] },
    { id: 'dodgers-3a', name: 'OKC Dodgers (3A)', level: '3A', coords: [-97.51, 35.46] },
    { id: 'dodgers-2a', name: 'Tulsa Drillers (2A)', level: '2A', coords: [-95.99, 36.15] },
    { id: 'dodgers-1a', name: 'Rancho Cucamonga (1A)', level: '1A', coords: [-117.57, 37.10] },
  ];

  useEffect(() => {
    const drawMap = async () => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const { width, height } = dimensions;

      // 1. 投影設定
      const projection = d3.geoAlbersUsa()
        .scale(1200) // 放大一點
        .translate([width / 2, height / 2]);

      // 2. 獲取並處理地理數據
      // 這是修正的關鍵：我們需要 geometry 數據來做碰撞檢測
      const usData = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
      
      // 將 TopoJSON 轉換為 GeoJSON Feature (這是包含美國所有州的形狀)
      // 使用 'nation' 會得到整個美國的外框，比 'states' 處理起來更快且不會有州界線造成的空隙
      // 注意：us-atlas 有些版本用 nation, 有些用 states，這裡我們合併所有 states
      const geojson = topojson.feature(usData, usData.objects.states); 

      // 3. 生成點陣 (嚴格過濾版)
      const points = [];
      const step = 12; // 點的間距

      // --- 修正重點開始 ---
      
      // 我們需要檢查每個點是否在 "任何一個州" 裡面
      // 為了效能，我們只在 "可能有美國" 的區域運算，而不是全畫布
      // 但簡單起見，我們先跑全迴圈，重點是檢查邏輯
      
      for (let x = 0; x <= width; x += step) {
        for (let y = 0; y <= height; y += step) {
          // 反轉座標：螢幕像素 -> 經緯度
          const coords = projection.invert([x, y]);

          // 第一關：Projection 必須算得出東西 (排除阿拉斯加與夏威夷以外的無效區)
          if (coords) {
            // 第二關：嚴格檢查該經緯度是否在美國 GeoJSON 形狀內
            // d3.geoContains(feature, point) 返回 true/false
            if (d3.geoContains(geojson, coords)) {
               points.push({ x, y });
            }
          }
        }
      }
      // --- 修正重點結束 ---

      // 4. 繪製基礎灰色點
      svg.append("g")
        .selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 3) // 稍微調小一點，讓形狀更精緻
        .attr("fill", "#D1D5DB") // Tailwind gray-300
        .attr("opacity", 1);

      // 5. 繪製球隊 (保持原本邏輯，但優化層級)
      const locationGroup = svg.append("g").attr("class", "team-locations");
      
      // 畫連線 (選用：如果你想連起來)
    //   const pathGenerator = d3.geoPath().projection(projection);

      locationGroup.selectAll(".team-dot")
        .data(teamLocations)
        .enter()
        .append("circle")
        .attr("cx", d => projection(d.coords)[0])
        .attr("cy", d => projection(d.coords)[1])
        .attr("r", 6)
        .attr("fill", "#3B82F6") // Tailwind blue-500
        .attr("stroke", "white")
        .attr("stroke-width", 2);

      // 標籤 (稍微調整位置以免擋住點)
      const labels = locationGroup.selectAll(".team-label")
        .data(teamLocations)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${projection(d.coords)[0]}, ${projection(d.coords)[1] - 15})`);

      labels.append("rect")
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 16)
        .attr("rx", 4)
        .attr("fill", "#93C5FD")
        .attr("opacity", 0.8);

      labels.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -3)
        .style("font-size", "9px")
        .style("font-family", "sans-serif")
        .style("font-weight", "bold")
        .text(d => d.level);
    };

    drawMap();

    // ... resize logic ...

  }, [dimensions]);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default USA_DotMap;