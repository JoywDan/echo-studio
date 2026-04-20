/* A v3 — asymmetric composition
   Canvas: 1200 × 760. Floor y=500. Desk top y=470.
   Computer zone shifted right; chair moved left with full perspective;
   crystal ball focal point above cabinet on left.
*/

export function buildRoomA3(){
  const p = {
    cream:'#F7F1E8', cream2:'#F2E8DA',
    coral:'#E08566', coralD:'#C86A4E', coralS:'#F0B9A4', coralXS:'#F7D4C5',
    slate:'#A9BBC8', slateD:'#7E96A8',
    milkP:'#E9C9BD', milkPD:'#D4A896',
    sage:'#A9BDA3', sageD:'#7F9A7A',
    lav:'#C5B9D6', lavD:'#A396B8', lavXD:'#8672A3',
    ink:'#3B2F2A', inkSoft:'#6B5B52',
    white:'#FBF7F0',
    shadow:'rgba(80,55,45,0.14)', shadowD:'rgba(80,55,45,0.22)',
    wall:'#F5E5D7', wallHi:'#FBF0E3',
    floor:'#EBD7C4', floor2:'#DBC2AB',
    desk:'#D99B7C', deskTop:'#E6B093', deskEdge:'#B27756',
    chair:'#E9A68A', chairD:'#C17F63', chairL:'#F2BEA6',
    accent:'#E08566', accent2:'#F0B9A4',
    rug:'#F2C9B8', rugDash:'#C88872',
    pot:'#D4A896', potRim:'#E9C9BD',
    lamp:'#E08566', lampD:'#C86A4E',
    cardigan:'#F5E4D6', cardiganD:'#D9BFA8',
    cardigan2:'#E9C9BD',
    cardigan2D:'#D4A896',
    cabinet:'#EFBFAE', cabinetD:'#D4A092',
    brass:'#C99A6B', brassD:'#9C7247', brassL:'#E8C890',
    crystal:'#B9A3DA', crystalD:'#8B75B6', crystalL:'#E0D2F0',
    crystalMist:'#CBB8E4',
    rugL:'#F0C3B2', rugLD:'#D49984',
  };

  const defs = `<defs>
    <linearGradient id="wallG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.wallHi}"/><stop offset="1" stop-color="${p.wall}"/>
    </linearGradient>
    <linearGradient id="floorG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.floor}"/><stop offset="1" stop-color="${p.floor2}"/>
    </linearGradient>
    <linearGradient id="winG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E8EEF0"/>
      <stop offset=".55" stop-color="#F4DDC4"/>
      <stop offset="1" stop-color="#EFC49F"/>
    </linearGradient>
    <linearGradient id="sun-A3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBE7CC" stop-opacity=".85"/>
      <stop offset="1" stop-color="#FBE7CC" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="deskG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.deskTop}"/><stop offset="1" stop-color="${p.desk}"/>
    </linearGradient>
    <linearGradient id="screenG-A3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2E3A45"/><stop offset="1" stop-color="#1F2830"/>
    </linearGradient>
    <radialGradient id="lampPool-A3" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#FFDB9A" stop-opacity=".9"/>
      <stop offset=".55" stop-color="#FFCB7A" stop-opacity=".4"/>
      <stop offset="1" stop-color="#FFDB9A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lampGlow-A3" cx=".5" cy=".3" r=".9">
      <stop offset="0" stop-color="#FFE7BE" stop-opacity=".55"/>
      <stop offset="1" stop-color="#FFE7BE" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cabinetG-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4C9BA"/><stop offset="1" stop-color="${p.cabinet}"/>
    </linearGradient>
    <!-- crystal ball gradients -->
    <radialGradient id="crystalBody-A3" cx=".38" cy=".36" r=".75">
      <stop offset="0" stop-color="#F3E8FB"/>
      <stop offset=".25" stop-color="${p.crystalL}"/>
      <stop offset=".65" stop-color="${p.crystal}"/>
      <stop offset="1" stop-color="${p.crystalD}"/>
    </radialGradient>
    <radialGradient id="crystalHalo-A3" cx=".5" cy=".5" r=".55">
      <stop offset="0" stop-color="#D9C2F2" stop-opacity=".8"/>
      <stop offset=".55" stop-color="#C9B0EC" stop-opacity=".35"/>
      <stop offset="1" stop-color="#C9B0EC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="crystalMist-A3" cx=".5" cy=".55" r=".45">
      <stop offset="0" stop-color="#F5ECFC" stop-opacity=".7"/>
      <stop offset=".55" stop-color="#C8B2E6" stop-opacity=".45"/>
      <stop offset="1" stop-color="#9479BC" stop-opacity=".2"/>
    </radialGradient>
    <linearGradient id="crystalWall-A3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D9C2F2" stop-opacity=".32"/>
      <stop offset="1" stop-color="#D9C2F2" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

  // ---------- shell ----------
  const shell = `
    <rect x="0" y="0" width="1200" height="500" fill="url(#wallG-A3)"/>
    <rect x="0" y="494" width="1200" height="8" fill="${p.cream2}" opacity=".55"/>
    <rect x="0" y="500" width="1200" height="260" fill="url(#floorG-A3)"/>
    ${[590,680].map(y=>`<rect x="0" y="${y}" width="1200" height="1.2" fill="${p.floor2}" opacity=".5"/>`).join('')}
    ${[180,470,780,1060].map(x=>`<rect x="${x}" y="500" width="1" height="260" fill="${p.floor2}" opacity=".35"/>`).join('')}
    <polygon points="90,500 280,500 360,760 0,760" fill="url(#sun-A3)" opacity=".8"/>
  `;

  // crystal ball ambient wall wash - drawn before window so it's behind items
  const crystalWallWash = `
    <ellipse cx="200" cy="230" rx="170" ry="120" fill="url(#crystalWall-A3)" opacity=".85"/>
  `;

  // ---------- window ----------
  const windowEl = `
    <g class="room-hit room-station" data-station="travel" tabindex="0" role="button">
      <rect x="94" y="74" width="272" height="192" rx="5" fill="${p.cream2}"/>
      <rect x="100" y="80" width="260" height="180" rx="2" fill="url(#winG-A3)"/>
      <rect x="228" y="80" width="4" height="180" fill="${p.cream2}"/>
      <rect x="100" y="168" width="260" height="4" fill="${p.cream2}"/>
      <path d="M100 180 Q140 158 180 168 Q220 176 228 172 L228 180 Z" fill="${p.sage}" opacity=".22"/>
      <path d="M232 180 Q270 160 310 170 Q340 178 360 172 L360 180 Z" fill="${p.sage}" opacity=".22"/>
      <polygon points="110,88 134,88 232,250 208,250" fill="#ffffff" opacity=".18"/>
    </g>
  `;

  // sill items
  const sillItems = `
    <g>
      <rect x="90" y="258" width="280" height="14" rx="2" fill="${p.cream2}"/>
      <rect x="90" y="272" width="280" height="3" fill="${p.shadow}" opacity=".5"/>
      <ellipse cx="230" cy="258" rx="130" ry="3" fill="${p.shadow}" opacity=".3"/>
      <!-- frame -->
      <g>
        <rect x="248" y="204" width="56" height="56" rx="2" fill="${p.milkPD}"/>
        <rect x="253" y="209" width="46" height="46" fill="${p.wallHi}"/>
        <rect x="253" y="240" width="46" height="15" fill="${p.sage}" opacity=".75"/>
        <circle cx="266" cy="224" r="5" fill="${p.coralS}"/>
        <rect x="278" y="216" width="16" height="16" fill="${p.slate}" opacity=".7"/>
        <rect x="248" y="258" width="56" height="2" fill="${p.shadow}" opacity=".45"/>
      </g>
      <!-- standing books -->
      <g>
        <rect x="116" y="196" width="20" height="64" rx="1.5" fill="${p.coral}"/>
        <rect x="120" y="204" width="12" height="1.8" fill="${p.wallHi}" opacity=".7"/>
        <rect x="120" y="210" width="12" height="1.5" fill="${p.wallHi}" opacity=".5"/>
        <rect x="120" y="252" width="12" height="1.8" fill="${p.wallHi}" opacity=".7"/>
      </g>
      <g>
        <rect x="138" y="210" width="16" height="50" rx="1.5" fill="${p.slate}"/>
        <rect x="141" y="220" width="10" height="1.5" fill="${p.wallHi}" opacity=".7"/>
      </g>
      <!-- book stack -->
      <g>
        <rect x="160" y="246" width="78" height="10" rx="1.5" fill="${p.sage}"/>
        <rect x="160" y="252" width="78" height="4" fill="${p.sageD}" opacity=".5"/>
        <rect x="170" y="238" width="64" height="9" rx="1.5" fill="${p.milkP}"/>
        <rect x="170" y="244" width="64" height="3" fill="${p.milkPD}" opacity=".5"/>
      </g>
      <!-- cactus/mini plant -->
      <g>
        <path d="M316 240 L356 240 L351 260 L321 260 Z" fill="${p.potRim}"/>
        <rect x="316" y="238" width="40" height="4" rx="1" fill="${p.pot}"/>
        <ellipse cx="336" cy="240" rx="18" ry="2" fill="${p.ink}" opacity=".3"/>
        <ellipse cx="326" cy="226" rx="5" ry="11" fill="${p.sage}" transform="rotate(-18 326 226)"/>
        <ellipse cx="336" cy="218" rx="5" ry="14" fill="${p.sageD}"/>
        <ellipse cx="346" cy="226" rx="5" ry="11" fill="${p.sage}" transform="rotate(18 346 226)"/>
      </g>
    </g>
  `;

  // ---------- cabinet (below window, unchanged position) ----------
  const cabinet = `
    <g class="room-hit room-station" data-station="vps" tabindex="0" role="button">
      <ellipse cx="200" cy="500" rx="110" ry="7" fill="${p.shadow}" opacity=".35"/>
      <rect x="110" y="320" width="180" height="180" rx="10" fill="url(#cabinetG-A3)"/>
      <rect x="104" y="316" width="192" height="10" rx="3" fill="${p.coralXS}"/>
      <rect x="104" y="322" width="192" height="4" fill="${p.cabinetD}" opacity=".4"/>
      <rect x="118" y="382" width="164" height="2" fill="${p.cabinetD}" opacity=".55"/>
      <rect x="118" y="442" width="164" height="2" fill="${p.cabinetD}" opacity=".55"/>
      ${[334, 394, 454].map(y=>`<rect x="122" y="${y}" width="156" height="40" rx="4" fill="none" stroke="${p.cabinetD}" stroke-width="1" opacity=".25"/>`).join('')}
      ${[354, 414, 474].map(y=>`
        <g>
          <ellipse cx="200" cy="${y+2}" rx="6" ry="2" fill="${p.shadow}" opacity=".35"/>
          <circle cx="200" cy="${y}" r="5" fill="${p.brass}"/>
          <circle cx="198.5" cy="${y-1.2}" r="1.5" fill="#FFEFCC" opacity=".8"/>
          <circle cx="200" cy="${y}" r="5" fill="none" stroke="${p.brassD}" stroke-width="1"/>
        </g>
      `).join('')}
      <rect x="110" y="320" width="6" height="180" fill="${p.cabinetD}" opacity=".2"/>
      <rect x="284" y="320" width="6" height="180" fill="${p.cabinetD}" opacity=".2"/>

      <!-- ceramic cat (to the left of crystal ball) -->
      <g transform="translate(118,280)">
        <ellipse cx="14" cy="38" rx="16" ry="3" fill="${p.shadow}" opacity=".3"/>
        <path d="M4 34 Q0 18 10 10 Q20 6 28 12 Q32 24 30 34 Z" fill="${p.white}"/>
        <circle cx="18" cy="14" r="10" fill="${p.white}"/>
        <polygon points="11,6 13,14 17,10" fill="${p.white}"/>
        <polygon points="25,6 23,14 19,10" fill="${p.white}"/>
        <polygon points="12,7 13,12 16,10" fill="${p.coralS}"/>
        <polygon points="24,7 23,12 20,10" fill="${p.coralS}"/>
        <circle cx="15" cy="15" r=".9" fill="${p.ink}"/>
        <circle cx="21" cy="15" r=".9" fill="${p.ink}"/>
        <path d="M17 18 Q18 19 19 18" fill="none" stroke="${p.ink}" stroke-width=".8" stroke-linecap="round"/>
        <circle cx="13.5" cy="17.5" r="1.3" fill="${p.coralS}" opacity=".7"/>
        <circle cx="22.5" cy="17.5" r="1.3" fill="${p.coralS}" opacity=".7"/>
        <path d="M30 30 Q38 26 36 18 Q33 14 30 18" fill="none" stroke="${p.white}" stroke-width="4" stroke-linecap="round"/>
        <path d="M12 22 Q18 25 24 22" fill="none" stroke="${p.coral}" stroke-width="1.5"/>
        <circle cx="18" cy="24" r="1.2" fill="${p.brass}"/>
      </g>

      <!-- succulent (to the right of crystal ball) -->
      <g transform="translate(258,288)">
        <ellipse cx="14" cy="30" rx="14" ry="2.5" fill="${p.shadow}" opacity=".3"/>
        <path d="M2 20 L26 20 L23 30 L5 30 Z" fill="${p.potRim}"/>
        <rect x="2" y="18" width="24" height="3" fill="${p.pot}"/>
        <g transform="translate(14,16)">
          <ellipse cx="0" cy="-4" rx="3.5" ry="6" fill="${p.sageD}"/>
          <ellipse cx="-5" cy="-2" rx="3.5" ry="5" fill="${p.sage}" transform="rotate(-40 -5 -2)"/>
          <ellipse cx="5" cy="-2" rx="3.5" ry="5" fill="${p.sage}" transform="rotate(40 5 -2)"/>
          <ellipse cx="-2" cy="-7" rx="2.5" ry="4" fill="${p.sage}"/>
          <ellipse cx="2" cy="-7" rx="2.5" ry="4" fill="${p.sageD}"/>
          <circle cx="0" cy="-5" r="1.5" fill="${p.sageD}"/>
        </g>
      </g>
    </g>
  `;

  // ---------- Crystal ball (centered above cabinet) ----------
  // cabinet top y ≈ 316, center x = 200
  // Ball sits ABOVE the cabinet top: base at y≈310, ball floats at y≈240
  // Ball radius ~46px.
  const crystalBall = `
    <g class="room-hit room-station" data-station="inner" tabindex="0" role="button">
      <!-- broad halo on wall behind ball -->
      <circle cx="200" cy="238" r="100" fill="url(#crystalHalo-A3)"/>
      <!-- faint back-glow burst rays -->
      <g opacity=".35" stroke="${p.crystalL}" stroke-width="1.2" stroke-linecap="round" fill="none">
        <line x1="200" y1="140" x2="200" y2="160"/>
        <line x1="132" y1="238" x2="152" y2="238"/>
        <line x1="248" y1="238" x2="268" y2="238"/>
        <line x1="148" y1="186" x2="160" y2="198"/>
        <line x1="252" y1="186" x2="240" y2="198"/>
        <line x1="150" y1="290" x2="162" y2="278"/>
        <line x1="250" y1="290" x2="238" y2="278"/>
      </g>

      <!-- brass tripod base (antique ornate style, front-view) -->
      <g>
        <!-- base shadow on cabinet top -->
        <ellipse cx="200" cy="315" rx="30" ry="3.5" fill="${p.shadow}" opacity=".55"/>
        <!-- bottom disc -->
        <ellipse cx="200" cy="312" rx="26" ry="4" fill="${p.brassD}"/>
        <ellipse cx="200" cy="310" rx="26" ry="4" fill="${p.brass}"/>
        <!-- 3 legs (curled ornate) - outer two angled, middle straight -->
        <g fill="${p.brass}" stroke="${p.brassD}" stroke-width=".7">
          <path d="M178 310 Q170 300 174 288 Q180 280 184 286 Q186 294 184 304 Z"/>
          <path d="M222 310 Q230 300 226 288 Q220 280 216 286 Q214 294 216 304 Z"/>
          <path d="M196 310 L196 284 L204 284 L204 310 Z"/>
        </g>
        <!-- ornate scroll flourishes -->
        <g fill="none" stroke="${p.brassD}" stroke-width="1">
          <path d="M176 295 Q170 292 172 288"/>
          <path d="M224 295 Q230 292 228 288"/>
        </g>
        <!-- cradle ring (top cup holding ball) -->
        <ellipse cx="200" cy="284" rx="22" ry="5" fill="${p.brassD}"/>
        <ellipse cx="200" cy="282" rx="22" ry="5" fill="${p.brass}"/>
        <ellipse cx="200" cy="281" rx="18" ry="3" fill="${p.brassL}" opacity=".7"/>
        <!-- small dot studs on cradle rim -->
        ${[-18,-9,0,9,18].map(dx=>`<circle cx="${200+dx}" cy="282" r="1" fill="${p.brassL}"/>`).join('')}
      </g>

      <!-- crystal ball body -->
      <g>
        <!-- drop shadow -->
        <ellipse cx="200" cy="283" rx="36" ry="5" fill="${p.shadow}" opacity=".3"/>
        <!-- ball glow soft -->
        <circle cx="200" cy="240" r="54" fill="${p.crystalL}" opacity=".25"/>
        <!-- ball body -->
        <circle cx="200" cy="240" r="44" fill="url(#crystalBody-A3)"/>
        <!-- inner nebula mist -->
        <g opacity=".9">
          <ellipse cx="192" cy="244" rx="28" ry="18" fill="url(#crystalMist-A3)">
            <animate attributeName="rx" values="28;32;28" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="cx" values="192;204;192" dur="6s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="208" cy="232" rx="18" ry="12" fill="${p.crystalMist}" opacity=".45">
            <animate attributeName="cx" values="208;196;208" dur="7s" repeatCount="indefinite"/>
          </ellipse>
        </g>
        <!-- floating star sparkles inside -->
        ${[
          {x:186,y:224,r:1.4,d:3.2},
          {x:212,y:234,r:1.6,d:4.0},
          {x:196,y:252,r:1.2,d:2.8},
          {x:218,y:252,r:1.1,d:3.6},
          {x:184,y:248,r:1.3,d:4.2},
        ].map((s,i)=>`
          <g>
            <circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#ffffff">
              <animate attributeName="opacity" values=".4;1;.4" dur="${s.d}s" begin="${i*.3}s" repeatCount="indefinite"/>
            </circle>
            <circle cx="${s.x}" cy="${s.y}" r="${s.r*2.5}" fill="#ffffff" opacity=".15">
              <animate attributeName="opacity" values="0;.3;0" dur="${s.d}s" begin="${i*.3}s" repeatCount="indefinite"/>
            </circle>
          </g>
        `).join('')}
        <!-- specular highlight -->
        <ellipse cx="184" cy="222" rx="12" ry="8" fill="#ffffff" opacity=".6"/>
        <ellipse cx="178" cy="218" rx="5" ry="3" fill="#ffffff" opacity=".9"/>
        <!-- lower rim reflection -->
        <path d="M168 258 Q200 272 232 258" fill="none" stroke="${p.crystalL}" stroke-width="2" opacity=".5"/>
      </g>

      <!-- external floating star motes around ball -->
      <g>
        ${[
          {x:132,y:200,r:1.5,d:2.8},
          {x:268,y:212,r:1.8,d:3.6},
          {x:258,y:272,r:1.3,d:4.2},
          {x:148,y:272,r:1.5,d:3.2},
          {x:200,y:162,r:1.6,d:2.6},
          {x:118,y:248,r:1.2,d:4.8},
          {x:280,y:254,r:1.2,d:3.8},
        ].map((s,i)=>`
          <g>
            <path d="M${s.x} ${s.y-s.r*2} L${s.x+s.r*.4} ${s.y-s.r*.4} L${s.x+s.r*2} ${s.y} L${s.x+s.r*.4} ${s.y+s.r*.4} L${s.x} ${s.y+s.r*2} L${s.x-s.r*.4} ${s.y+s.r*.4} L${s.x-s.r*2} ${s.y} L${s.x-s.r*.4} ${s.y-s.r*.4} Z" fill="${p.lav}">
              <animate attributeName="opacity" values=".3;1;.3" dur="${s.d}s" begin="${i*.25}s" repeatCount="indefinite"/>
            </path>
          </g>
        `).join('')}
      </g>
    </g>
  `;

  // ---------- corkboard + photos ----------
  const corkboard = `
    <g class="room-hit room-station" data-station="diary" tabindex="0" role="button">
      <rect x="410" y="120" width="150" height="110" rx="3" fill="#D4B591"/>
      <rect x="410" y="120" width="150" height="110" rx="3" fill="none" stroke="${p.inkSoft}" stroke-width="2" opacity=".25"/>
      ${Array.from({length:28},(_,i)=>{
        const x=412+((i*37)%146), y=122+((i*53)%106);
        return `<circle cx="${x}" cy="${y}" r=".7" fill="#B89878" opacity=".4"/>`;
      }).join('')}
      <g transform="translate(420,134) rotate(-4)">
        <rect x="0" y="0" width="48" height="36" fill="${p.white}"/>
        <rect x="3" y="3" width="42" height="26" fill="${p.slate}" opacity=".75"/>
        <rect x="3" y="29" width="42" height="4" fill="${p.sage}" opacity=".6"/>
        <circle cx="24" cy="-2" r="2.5" fill="${p.coralD}"/>
        <circle cx="23" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(488,128) rotate(5)">
        <rect x="0" y="0" width="50" height="38" fill="${p.white}"/>
        <rect x="3" y="3" width="44" height="32" fill="${p.milkP}"/>
        <circle cx="15" cy="16" r="6" fill="${p.coralS}"/>
        <rect x="22" y="22" width="22" height="10" fill="${p.sage}" opacity=".6"/>
        <circle cx="25" cy="-2" r="2.5" fill="${p.coralD}"/>
        <circle cx="24" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <g transform="translate(440,182) rotate(2)">
        <rect x="0" y="0" width="56" height="34" fill="${p.white}"/>
        <rect x="3" y="3" width="50" height="24" fill="${p.sageD}" opacity=".55"/>
        <rect x="3" y="27" width="50" height="4" fill="${p.coralS}"/>
        <circle cx="28" cy="-2" r="2.5" fill="${p.coralD}"/>
        <circle cx="27" cy="-2.6" r=".8" fill="#fff" opacity=".8"/>
      </g>
      <ellipse cx="485" cy="234" rx="78" ry="2" fill="${p.shadow}" opacity=".35"/>
    </g>
  `;

  // sticky note
  const stickyNote = `
    <g class="room-hit room-decor-v3" data-decor="ph-sticky" tabindex="0" role="button" transform="translate(600,130) rotate(-4)">
      <rect x="-6" y="-6" width="86" height="90" fill="transparent" pointer-events="all"/>
      <rect x="0" y="0" width="74" height="74" fill="#F7D873"/>
      <path d="M0 74 L14 64 L0 64 Z" fill="#E2C057"/>
      <path d="M10 16 Q22 12 34 16 T58 16" fill="none" stroke="${p.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 28 Q20 24 32 28 T52 28" fill="none" stroke="${p.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 40 Q22 36 34 40 T60 40" fill="none" stroke="${p.ink}" stroke-width="1.4" opacity=".5"/>
      <path d="M10 52 Q18 48 28 52" fill="none" stroke="${p.ink}" stroke-width="1.4" opacity=".5"/>
      <circle cx="37" cy="6" r="6" fill="${p.coralD}"/>
      <circle cx="35" cy="4" r="1.8" fill="#ffffff" opacity=".75"/>
      <rect x="2" y="74" width="72" height="3" fill="${p.shadow}" opacity=".35"/>
    </g>
  `;

  // clock
  const clock = `
    <g class="room-hit room-station" data-station="timeline" tabindex="0" role="button" transform="translate(1050,125)">
      <ellipse cx="2" cy="50" rx="38" ry="3" fill="${p.shadow}" opacity=".35"/>
      <circle cx="0" cy="0" r="48" fill="${p.white}"/>
      <circle cx="0" cy="0" r="48" fill="none" stroke="${p.cream2}" stroke-width="3"/>
      ${[0,90,180,270].map(a=>`<rect x="-1" y="-43" width="2" height="6" fill="${p.inkSoft}" transform="rotate(${a})"/>`).join('')}
      ${[30,60,120,150,210,240,300,330].map(a=>`<circle cx="0" cy="-39" r="1.2" fill="${p.inkSoft}" opacity=".55" transform="rotate(${a})"/>`).join('')}
      <rect x="-1.2" y="-28" width="2.4" height="30" rx="1.2" fill="${p.ink}" transform="rotate(30)"/>
      <rect x="-1" y="-18" width="2" height="22" rx="1" fill="${p.coralD}" transform="rotate(110)"/>
      <circle cx="0" cy="0" r="3" fill="${p.ink}"/>
    </g>
  `;

  // ---------- rugs ----------
  // right rug: pink oval under chair area (chair at x~500, so move oval LEFT to match)
  // but wait chair is now at ~500; the oval rug should be under desk+chair — move oval to x=630 for visual balance under chair
  const rugRight = `
    <g>
      <ellipse cx="640" cy="728" rx="240" ry="18" fill="${p.rug}"/>
      <ellipse cx="640" cy="728" rx="220" ry="12" fill="none" stroke="${p.rugDash}" stroke-width=".8" opacity=".4"/>
      ${[-170,-85,0,85,170].map(dx=>`<rect x="${640+dx-1.5}" y="716" width="3" height="24" fill="${p.rugDash}" opacity=".15"/>`).join('')}
    </g>
  `;

  // left rug: rectangular coral, in front of cabinet
  const rugLeft = `
    <g>
      <!-- soft shadow -->
      <ellipse cx="230" cy="700" rx="140" ry="6" fill="${p.shadow}" opacity=".25"/>
      <!-- rug -->
      <rect x="100" y="642" width="260" height="60" rx="4" fill="${p.rugL}"/>
      <!-- fringe ends -->
      <g stroke="${p.rugLD}" stroke-width="1" opacity=".55">
        ${Array.from({length:22},(_,i)=>`<line x1="${102+i*12}" y1="702" x2="${102+i*12}" y2="708"/>`).join('')}
        ${Array.from({length:22},(_,i)=>`<line x1="${102+i*12}" y1="636" x2="${102+i*12}" y2="642"/>`).join('')}
      </g>
      <!-- inner border lines -->
      <rect x="108" y="650" width="244" height="44" rx="2" fill="none" stroke="${p.rugLD}" stroke-width=".8" opacity=".55"/>
      <!-- simple boho pattern (dashes) -->
      <g stroke="${p.rugLD}" stroke-width="1" opacity=".45">
        ${[660, 680].map(y=>Array.from({length:12},(_,i)=>`<line x1="${120+i*20}" y1="${y}" x2="${128+i*20}" y2="${y}"/>`).join('')).join('')}
      </g>
      <!-- center diamond motif -->
      <g transform="translate(230,672)" fill="none" stroke="${p.rugLD}" stroke-width="1" opacity=".6">
        <path d="M-18 0 L0 -10 L18 0 L0 10 Z"/>
        <path d="M-10 0 L0 -6 L10 0 L0 6 Z"/>
      </g>
    </g>
  `;

  // slipper (front-left floor, between rugs)
  const slipper = `
    <g>
      <ellipse cx="382" cy="690" rx="30" ry="5" fill="${p.shadow}" opacity=".4"/>
      <g transform="translate(362,674) rotate(-8)">
        <path d="M0 0 Q0 -10 14 -10 L34 -8 Q46 -6 44 5 Q42 14 28 14 L10 14 Q0 13 0 5 Z" fill="${p.coralS}"/>
        <ellipse cx="8" cy="2" rx="7" ry="5" fill="${p.coralD}" opacity=".3"/>
        <path d="M5 -2 Q18 -8 32 -4" fill="none" stroke="${p.coralD}" stroke-width="1.5" opacity=".6"/>
      </g>
    </g>
  `;

  // desk
  const desk = `
    <g>
      <ellipse cx="650" cy="718" rx="340" ry="9" fill="${p.shadow}" opacity=".35"/>
      <rect x="330" y="470" width="640" height="14" rx="3" fill="url(#deskG-A3)"/>
      <rect x="330" y="482" width="640" height="3" fill="${p.deskEdge}" opacity=".7"/>
      <rect x="338" y="484" width="18" height="230" fill="${p.desk}"/>
      <rect x="338" y="484" width="18" height="230" fill="${p.deskEdge}" opacity=".3"/>
      <rect x="944" y="484" width="18" height="230" fill="${p.desk}"/>
      <rect x="944" y="484" width="18" height="230" fill="${p.deskEdge}" opacity=".3"/>
      <rect x="950" y="540" width="8" height="40" rx="1" fill="${p.deskEdge}" opacity=".55"/>
      <circle cx="954" cy="560" r="1.4" fill="${p.ink}" opacity=".55"/>
    </g>
  `;

  // ---------- chair (LEFT of monitor, full view 3/4 perspective) ----------
  // chair center x = 490, facing slightly right (toward monitor)
  // backrest top y=250, seat at y=492, wheelbase at y=580
  const chair = `
    <g>
      <!-- floor shadow under chair -->
      <ellipse cx="490" cy="722" rx="120" ry="10" fill="${p.shadow}" opacity=".42"/>

      <!-- BACKREST (tall, from y=248 to y=478, slight 3/4 tilt right) -->
      <g>
        <!-- back panel shadow (darker right side for 3/4) -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L562 470 Q552 484 536 484 L450 484 Q434 484 418 470 Z" fill="${p.chair}"/>
        <!-- top pillow/rim highlight -->
        <path d="M416 262 Q430 246 450 246 L536 246 Q552 246 560 262 L560 280 Q544 268 490 268 Q436 268 418 280 Z" fill="${p.chairL}" opacity=".55"/>
        <!-- right side shadow (3/4 view) -->
        <path d="M546 262 L562 262 L562 470 L548 480 Z" fill="${p.chairD}" opacity=".45"/>
        <!-- center stitch -->
        <rect x="489" y="270" width="2" height="200" fill="${p.chairD}" opacity=".3"/>
        <!-- horizontal quilt lines -->
        ${[310,355,400,445].map(y=>`<path d="M432 ${y} Q490 ${y+3} 548 ${y}" fill="none" stroke="${p.chairD}" stroke-width="1" opacity=".3"/>`).join('')}

        <!-- CARDIGAN draped over top of backrest -->
        <g>
          <!-- body hanging down the LEFT side -->
          <path d="M436 258 Q448 246 462 250 L468 406 Q454 420 436 412 Z" fill="${p.cardigan}"/>
          <!-- shoulder highlight -->
          <path d="M436 258 Q448 246 462 250 L462 270 Q448 260 438 266 Z" fill="#FFFFFF" opacity=".45"/>
          <!-- button line -->
          <rect x="449" y="266" width="1.6" height="140" fill="${p.cardiganD}" opacity=".6"/>
          <circle cx="450" cy="290" r="1.6" fill="${p.cardiganD}"/>
          <circle cx="450" cy="316" r="1.6" fill="${p.cardiganD}"/>
          <circle cx="450" cy="342" r="1.6" fill="${p.cardiganD}"/>
          <circle cx="450" cy="368" r="1.6" fill="${p.cardiganD}"/>
          <!-- knit texture hints -->
          <g stroke="${p.cardiganD}" stroke-width=".6" opacity=".35" fill="none">
            <path d="M440 278 Q444 282 440 286 Q436 290 440 294"/>
            <path d="M460 278 Q456 282 460 286 Q464 290 460 294"/>
          </g>
          <!-- bottom hem -->
          <ellipse cx="452" cy="406" rx="14" ry="4" fill="${p.cardiganD}" opacity=".5"/>
          <!-- drape over top edge (small bunch) -->
          <path d="M436 256 Q446 244 462 246 L458 260 Q446 252 438 262 Z" fill="${p.cardiganD}" opacity=".35"/>
        </g>
      </g>

      <!-- ARMRESTS (both visible, 3/4 so right armrest is behind) -->
      <!-- left armrest (near) -->
      <g>
        <rect x="384" y="430" width="32" height="12" rx="4" fill="${p.chairD}"/>
        <rect x="384" y="430" width="32" height="4" rx="2" fill="${p.chairL}" opacity=".55"/>
        <rect x="396" y="442" width="8" height="48" fill="${p.chairD}"/>
        <!-- arm cushion curve -->
        <path d="M384 434 Q400 428 416 434" fill="none" stroke="${p.chair}" stroke-width="2" opacity=".6"/>
      </g>
      <!-- right armrest (further, smaller due to perspective) -->
      <g>
        <rect x="562" y="434" width="30" height="11" rx="4" fill="${p.chairD}"/>
        <rect x="570" y="445" width="7" height="44" fill="${p.chairD}"/>
        <rect x="570" y="445" width="7" height="4" fill="${p.ink}" opacity=".25"/>
      </g>

      <!-- SEAT CUSHION (wide oval, in front of desk top) -->
      <g>
        <!-- cushion underside -->
        <path d="M406 498 Q490 506 576 498 L580 516 Q490 524 402 516 Z" fill="${p.chairD}"/>
        <!-- cushion top -->
        <path d="M402 498 Q490 490 582 498 L576 514 Q490 522 406 514 Z" fill="${p.chair}"/>
        <!-- top highlight -->
        <path d="M420 497 Q490 492 562 497" fill="none" stroke="${p.chairL}" stroke-width="2" opacity=".6"/>
        <!-- button tuft center -->
        <circle cx="490" cy="505" r="2.4" fill="${p.chairD}"/>
      </g>

      <!-- GAS LIFT POST connecting seat to wheelbase -->
      <g>
        <rect x="484" y="516" width="12" height="58" fill="${p.chairD}"/>
        <rect x="484" y="516" width="3" height="58" fill="${p.chairL}" opacity=".35"/>
        <rect x="493" y="516" width="3" height="58" fill="${p.ink}" opacity=".25"/>
        <!-- adjustment lever hint -->
        <rect x="496" y="532" width="10" height="2.5" rx="1" fill="${p.ink}" opacity=".5"/>
      </g>

      <!-- 5-STAR WHEELBASE at y=580 centered at x=490 -->
      <g transform="translate(490,578)">
        <!-- five legs splayed -->
        ${[-70,-35,0,35,70].map(a=>`
          <g transform="rotate(${a})">
            <path d="M-3.5 0 L-5 48 L0 56 L5 48 L3.5 0 Z" fill="${p.chairD}"/>
            <path d="M-3.5 0 L-1.5 0 L-2 48 L-5 48 Z" fill="${p.ink}" opacity=".25"/>
            <!-- wheel -->
            <ellipse cx="0" cy="52" rx="8" ry="4" fill="${p.shadow}" opacity=".3"/>
            <circle cx="0" cy="50" r="6" fill="${p.ink}"/>
            <circle cx="0" cy="50" r="4" fill="${p.inkSoft}"/>
            <circle cx="-1.5" cy="48.5" r="1.2" fill="#fff" opacity=".4"/>
          </g>`).join('')}
        <!-- center hub -->
        <circle cx="0" cy="0" r="8" fill="${p.chairD}"/>
        <circle cx="0" cy="0" r="5" fill="${p.ink}" opacity=".7"/>
        <circle cx="-1.5" cy="-1.5" r="1.5" fill="#fff" opacity=".4"/>
      </g>
    </g>
  `;

  // ---------- MONITOR (right-shifted, front view, -10%) ----------
  // old A2 monitor ~226x104 at x=580..802; new center x=820, width 204x96
  // screen area: x=718..922, y=302..400
  // bezel: x=712..928, y=296..406
  // stand base at y=470 centered x=820
  const monitor = `
    <g class="room-hit room-station" data-station="wechat" tabindex="0" role="button">
      <ellipse cx="820" cy="470" rx="120" ry="4" fill="${p.shadow}" opacity=".35"/>
      <path d="M790 467 Q820 463 850 467 L850 470 Q820 475 790 470 Z" fill="${p.ink}" opacity=".85"/>
      <rect x="812" y="408" width="16" height="60" rx="2" fill="${p.inkSoft}"/>
      <!-- bezel (front view rectangle) -->
      <rect x="712" y="296" width="216" height="114" rx="7" fill="#252F38"/>
      <!-- screen -->
      <rect x="718" y="302" width="204" height="102" rx="3" fill="url(#screenG-A3)"/>
      ${audioStudioUIA3(p)}
      <!-- led -->
      <circle cx="820" cy="408" r="1.5" fill="${p.sage}"/>
      <!-- screen glint -->
      <polygon points="720,302 740,302 728,400 720,400" fill="#ffffff" opacity=".05"/>
    </g>
  `;

  // ---------- gooseneck lamp (30% larger, LEFT of monitor) ----------
  // A2 lamp base was at (850, 468). Now move to x=640. 30% bigger.
  // base pad ~(640, 468), arm goes up+right, shade pointed down over desk near x=700
  const deskLamp = `
    <g class="room-hit room-station" data-station="voice" tabindex="0" role="button">
      <!-- wall glow behind -->
      <ellipse cx="680" cy="330" rx="130" ry="90" fill="url(#lampGlow-A3)" opacity=".85"/>
      <!-- BIG desk pool of light (drawn below keyboard/etc as part of desk surface) -->
      <ellipse cx="700" cy="478" rx="130" ry="20" fill="url(#lampPool-A3)"/>
      <!-- base -->
      <ellipse cx="640" cy="474" rx="32" ry="5" fill="${p.shadow}" opacity=".55"/>
      <ellipse cx="640" cy="468" rx="28" ry="6" fill="${p.lampD}"/>
      <rect x="612" y="458" width="56" height="11" rx="4" fill="${p.lamp}"/>
      <rect x="612" y="464" width="56" height="5" rx="2" fill="${p.lampD}" opacity=".4"/>
      <!-- gooseneck curve: thicker, taller, ending at shade above desk -->
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${p.lamp}" stroke-width="9" stroke-linecap="round"/>
      <path d="M640 458
               C 640 400, 600 370, 650 328
               C 706 284, 740 312, 722 362"
            fill="none" stroke="${p.coralS}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>
      <!-- hinge bulbs -->
      <circle cx="640" cy="458" r="5" fill="${p.lampD}"/>
      <!-- shade (larger, angled downward to light pool) -->
      <g transform="translate(720,368) rotate(28)">
        <path d="M-24 0 L24 0 L18 34 L-18 34 Z" fill="${p.lampD}"/>
        <path d="M-24 0 L24 0 L20 5 L-20 5 Z" fill="${p.lamp}"/>
        <ellipse cx="0" cy="34" rx="18" ry="4" fill="#FFE2B8"/>
        <ellipse cx="0" cy="34" rx="11" ry="2" fill="#FFF5DE"/>
      </g>
    </g>
  `;

  // ---------- keyboard + mouse (right-shifted, under lamp pool) ----------
  const keyboardMouse = `
    <g>
      <ellipse cx="780" cy="468" rx="110" ry="4" fill="${p.shadow}" opacity=".3"/>
      <rect x="678" y="452" width="206" height="18" rx="3" fill="${p.white}"/>
      <rect x="678" y="466" width="206" height="4" fill="${p.cream2}"/>
      ${Array.from({length:15},(_,i)=>`<rect x="${686+i*13}" y="456" width="10" height="4" rx="1" fill="${p.cream2}" opacity=".9"/>`).join('')}
      ${Array.from({length:15},(_,i)=>`<rect x="${686+i*13}" y="461" width="10" height="3" rx="1" fill="${p.cream2}" opacity=".7"/>`).join('')}
      <!-- mouse -->
      <ellipse cx="918" cy="464" rx="14" ry="9" fill="${p.white}"/>
      <path d="M918 455 Q924 455 926 462" fill="none" stroke="${p.cream2}" stroke-width=".8" opacity=".8"/>
      <ellipse cx="918" cy="470" rx="12" ry="2" fill="${p.shadow}" opacity=".35"/>
    </g>
  `;

  // ---------- mug (far-left front of desk) ----------
  const mug = `
    <g class="room-hit room-decor-v3" data-decor="ph-cup" tabindex="0" role="button">
      <ellipse cx="388" cy="470" rx="22" ry="3" fill="${p.shadow}" opacity=".4"/>
      <rect x="370" y="430" width="36" height="40" rx="4" fill="${p.white}"/>
      <ellipse cx="388" cy="432" rx="17" ry="3.5" fill="${p.ink}" opacity=".4"/>
      <path d="M406 442 Q424 446 424 456 Q424 466 406 462" fill="none" stroke="${p.white}" stroke-width="5" stroke-linecap="round"/>
      <rect x="370" y="456" width="36" height="2.5" fill="${p.accent}" opacity=".85"/>
      <g opacity=".55" fill="none" stroke="${p.slate}" stroke-width="2" stroke-linecap="round">
        <path d="M378 420 Q382 410 378 400 Q374 390 378 382"/>
        <path d="M388 418 Q392 406 388 394 Q384 384 388 376"/>
        <path d="M398 420 Q402 410 398 400"/>
      </g>
    </g>
  `;

  // ---------- file organizer (right-back of monitor, smaller) ----------
  // A2 had it at x=848..952, in front. Now move to right side behind monitor stand, near desk right edge
  const fileOrganizer = `
    <g>
      <ellipse cx="905" cy="472" rx="48" ry="3" fill="${p.shadow}" opacity=".4"/>
      <rect x="857" y="462" width="96" height="10" rx="3" fill="${p.milkP}"/>
      <rect x="857" y="469" width="96" height="3" fill="${p.milkPD}" opacity=".7"/>
      <rect x="857" y="404" width="2" height="60" fill="${p.milkPD}"/>
      <rect x="951" y="404" width="2" height="60" fill="${p.milkPD}"/>
      <g transform="translate(862,406)">
        <rect x="0" y="0" width="20" height="58" rx="2" fill="${p.coral}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${p.coralD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(884,408) rotate(3)">
        <rect x="0" y="0" width="20" height="56" rx="2" fill="${p.slate}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${p.slateD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(908,407) rotate(-2)">
        <rect x="0" y="0" width="20" height="57" rx="2" fill="${p.sage}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="${p.sageD}"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
      <g transform="translate(930,409) rotate(2)">
        <rect x="0" y="0" width="20" height="55" rx="2" fill="${p.milkPD}"/>
        <rect x="0" y="0" width="20" height="5" rx="2" fill="#B0897A"/>
        <rect x="2" y="12" width="14" height="1.6" fill="#fff" opacity=".5"/>
      </g>
    </g>
  `;

  // ---------- pen cup (far-right edge of desk, in front of file organizer) ----------
  const penCup = `
    <g>
      <ellipse cx="910" cy="475" rx="20" ry="3" fill="${p.shadow}" opacity=".4"/>
      <!-- positioned right of mouse -->
      <!-- using same pattern as v2 but moved -->
    </g>
  `;
  // Actually keep pen cup close to file organizer but off to front-right; put pen cup at x=410 BEHIND left corner? No, user said "pen cup retain". Put it to the LEFT of file organizer on desk in front of monitor stand base. Actually clearer: place it near right edge, at x~410 was mug; keep it with organizer. Put at x=830 (in front of monitor stand right side)
  const penCup2 = `
    <g>
      <ellipse cx="425" cy="472" rx="22" ry="3" fill="${p.shadow}" opacity=".4"/>
      <!-- next to mug, on desk left side -->
      <g transform="translate(410,430)">
        <path d="M0 0 L42 0 L40 40 L2 40 Z" fill="${p.coralS}"/>
        <rect x="0" y="-2" width="42" height="4" rx="1.5" fill="${p.coralD}" opacity=".6"/>
        <path d="M2 40 L40 40 L40 42 L2 42 Z" fill="${p.coralD}" opacity=".4"/>
        <g transform="translate(6,-20) rotate(-8)">
          <rect x="0" y="0" width="4" height="22" fill="${p.sage}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="22" width="4" height="3" fill="${p.coral}"/>
        </g>
        <g transform="translate(13,-25)">
          <rect x="0" y="0" width="4" height="28" fill="${p.coral}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="28" width="4" height="3" fill="${p.coralD}"/>
        </g>
        <g transform="translate(20,-22) rotate(4)">
          <rect x="0" y="0" width="4" height="26" fill="${p.slate}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="26" width="4" height="3" fill="${p.slateD}"/>
        </g>
        <g transform="translate(27,-26) rotate(-3)">
          <rect x="0" y="0" width="4" height="30" fill="${p.lav}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="30" width="4" height="3" fill="${p.lavD}"/>
        </g>
        <g transform="translate(35,-32) rotate(14)">
          <path d="M0 0 L2 22" stroke="#CFD6DB" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M2 0 L0 22" stroke="#B4BDC4" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="-3" cy="-2" r="3.5" fill="none" stroke="${p.coralD}" stroke-width="1.8"/>
          <circle cx="5" cy="-2" r="3.5" fill="none" stroke="${p.coralD}" stroke-width="1.8"/>
          <circle cx="1" cy="2" r="1" fill="${p.ink}"/>
        </g>
      </g>
    </g>
  `;
  // Actually user wants pen cup to stay with the organizer on the right. Keep mug alone on left.
  // Scrap penCup2 placement — relocate pen cup to the desk right, in front of the organizer
  const penCupRight = `
    <g>
      <ellipse cx="838" cy="472" rx="20" ry="3" fill="${p.shadow}" opacity=".4"/>
      <g transform="translate(820,432)">
        <path d="M0 0 L36 0 L34 38 L2 38 Z" fill="${p.coralS}"/>
        <rect x="0" y="-2" width="36" height="4" rx="1.5" fill="${p.coralD}" opacity=".6"/>
        <path d="M2 38 L34 38 L34 40 L2 40 Z" fill="${p.coralD}" opacity=".4"/>
        <g transform="translate(5,-18) rotate(-8)">
          <rect x="0" y="0" width="4" height="20" fill="${p.sage}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="20" width="4" height="3" fill="${p.coral}"/>
        </g>
        <g transform="translate(11,-22)">
          <rect x="0" y="0" width="4" height="26" fill="${p.coral}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="26" width="4" height="3" fill="${p.coralD}"/>
        </g>
        <g transform="translate(17,-19) rotate(4)">
          <rect x="0" y="0" width="4" height="24" fill="${p.slate}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="24" width="4" height="3" fill="${p.slateD}"/>
        </g>
        <g transform="translate(23,-22) rotate(-3)">
          <rect x="0" y="0" width="4" height="27" fill="${p.lav}"/>
          <polygon points="0,0 4,0 2,-5" fill="${p.ink}"/>
          <rect x="0" y="27" width="4" height="3" fill="${p.lavD}"/>
        </g>
        <g transform="translate(30,-28) rotate(14)">
          <path d="M0 0 L2 20" stroke="#CFD6DB" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M2 0 L0 20" stroke="#B4BDC4" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="-3" cy="-2" r="3.3" fill="none" stroke="${p.coralD}" stroke-width="1.6"/>
          <circle cx="5" cy="-2" r="3.3" fill="none" stroke="${p.coralD}" stroke-width="1.6"/>
          <circle cx="1" cy="2" r="1" fill="${p.ink}"/>
        </g>
      </g>
    </g>
  `;

  // ---------- floor plant (right, unchanged) ----------
  const floorPlant = `
    <g class="room-hit room-station" data-station="health" tabindex="0" role="button" transform="translate(1090,410)">
      <ellipse cx="0" cy="310" rx="56" ry="7" fill="${p.shadow}" opacity=".5"/>
      <path d="M-38 252 L38 252 L30 306 L-30 306 Z" fill="${p.potRim}"/>
      <path d="M-38 252 L38 252 L36 262 L-36 262 Z" fill="${p.pot}"/>
      <ellipse cx="0" cy="252" rx="38" ry="4" fill="${p.ink}" opacity=".45"/>
      <ellipse cx="0" cy="250" rx="32" ry="3" fill="${p.ink}" opacity=".55"/>
      <path d="M-3 250 Q-18 190 -40 128" fill="none" stroke="${p.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M2 250 Q14 188 42 136" fill="none" stroke="${p.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M-1 250 Q-6 200 8 158" fill="none" stroke="${p.sageD}" stroke-width="2.5" stroke-linecap="round"/>
      ${monsteraLeafA3(-42,124,-22,1,p)}
      ${monsteraLeafA3(44,132,22,.95,p)}
      ${monsteraLeafA3(-16,100,-6,1.08,p)}
      ${monsteraLeafA3(18,152,14,.82,p)}
      ${monsteraLeafA3(-28,176,-28,.72,p)}
    </g>
  `;

  // assemble (z-order: backgrounds → back wall items → cabinet + crystal → mid wall → rug → floor items → desk → chair (partly behind desk edge) → desktop items)
  return `<svg viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${defs}
    ${shell}
    ${crystalWallWash}
    ${windowEl}
    ${sillItems}
    ${corkboard}
    ${stickyNote}
    ${clock}
    ${cabinet}
    ${crystalBall}
    ${rugRight}
    ${rugLeft}
    ${floorPlant}
    ${slipper}
    ${chair}
    ${desk}
    ${monitor}
    ${deskLamp}
    ${keyboardMouse}
    ${mug}
    ${fileOrganizer}
    ${penCupRight}
  </svg>`;
}

// Audio studio UI for A3 monitor (front view)
// screen rect: x=718..922 (204w), y=302..404 (102h)
function audioStudioUIA3(p){
  let s = '';
  s += `
    <rect x="720" y="304" width="200" height="11" fill="#141B22" opacity=".9"/>
    <circle cx="726" cy="309.5" r="1.5" fill="${p.coralS}"/>
    <circle cx="732" cy="309.5" r="1.5" fill="#E8D187"/>
    <circle cx="738" cy="309.5" r="1.5" fill="${p.sage}"/>
    <rect x="744" y="307" width="28" height="4" rx="1" fill="#ffffff" opacity=".2"/>

    <rect x="720" y="317" width="52" height="62" fill="#1C242C" opacity=".9"/>
    <rect x="724" y="321" width="40" height="4" rx="1" fill="${p.coralS}" opacity=".9"/>
  `;
  const rowColors = [p.coral, p.lav, p.sage, p.slate];
  for (let i=0; i<4; i++){
    const y = 330 + i*12;
    s += `
      <circle cx="729" cy="${y+3}" r="3" fill="${rowColors[i]}"/>
      <rect x="735" y="${y+1.5}" width="20" height="3" rx="1" fill="#ffffff" opacity=".5"/>
      <rect x="735" y="${y+5}" width="14" height="2" rx="1" fill="#ffffff" opacity=".25"/>
      ${i===0?`<circle cx="761" cy="${y+3}" r="1.5" fill="${p.coral}"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></circle>`:''}
    `;
  }
  s += `
    <rect x="776" y="317" width="142" height="40" fill="#1C242C" opacity=".9"/>
    <rect x="780" y="321" width="30" height="3" rx="1" fill="${p.coralS}" opacity=".85"/>
    <rect x="880" y="320" width="34" height="5" rx="1" fill="#ffffff" opacity=".15"/>
  `;
  const n = 50;
  const heights = [];
  for (let i=0; i<n; i++){
    const v = Math.abs(Math.sin(i*0.8) * 0.6 + Math.sin(i*1.7)*0.3 + Math.sin(i*0.3)*0.25);
    heights.push(Math.max(2, Math.min(14, v*14 + 2)));
  }
  const barW = 2, barGap = 0.7;
  heights.forEach((h,i)=>{
    const x = 780 + i*(barW+barGap);
    const cy = 344;
    const fill = i<18 ? p.coral : '#6C7A86';
    s += `<rect x="${x.toFixed(2)}" y="${(cy-h/2).toFixed(2)}" width="${barW}" height="${h.toFixed(2)}" rx=".8" fill="${fill}"/>`;
  });
  s += `<rect x="817" y="328" width="1" height="24" fill="${p.coralS}" opacity=".9"/>`;
  s += `
    <rect x="776" y="359" width="142" height="18" fill="#1C242C" opacity=".9"/>
    <g transform="translate(796,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-2,-2 -2,2 -1,0" fill="#ffffff" opacity=".7"/>
      <rect x="-2.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(815,368)">
      <circle cx="0" cy="0" r="6.5" fill="${p.coral}"/>
      <polygon points="-1.8,-2.4 -1.8,2.4 2.2,0" fill="#ffffff"/>
    </g>
    <g transform="translate(834,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <polygon points="-1,-2 1,0 -1,2" fill="#ffffff" opacity=".7"/>
      <rect x="1.4" y="-2" width="1" height="4" fill="#ffffff" opacity=".7"/>
    </g>
    <g transform="translate(854,368)">
      <circle cx="0" cy="0" r="5" fill="#2B333A"/>
      <circle cx="0" cy="0" r="2.5" fill="${p.coralD}">
        <animate attributeName="opacity" values="1;.5;1" dur="1.4s" repeatCount="indefinite"/>
      </circle>
    </g>
    <rect x="870" y="367" width="40" height="2" rx="1" fill="#3A434B"/>
    <rect x="870" y="367" width="24" height="2" rx="1" fill="${p.coral}"/>
    <circle cx="894" cy="368" r="2.5" fill="#fff"/>
  `;
  return s;
}

function monsteraLeafA3(x,y,rot,scale,p){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${scale})">
    <path d="M0 0 Q-28 -8 -36 -30 Q-40 -56 -20 -70 Q4 -78 24 -66 Q40 -48 36 -26 Q30 -4 0 0 Z" fill="${p.sage}"/>
    <path d="M-2 -2 Q0 -34 10 -58" fill="none" stroke="${p.sageD}" stroke-width="1.1" opacity=".7"/>
    <path d="M-6 -16 L10 -22" stroke="${p.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-12 -34 L8 -40" stroke="${p.wall}" stroke-width="3" opacity=".9"/>
    <path d="M-16 -52 L4 -56" stroke="${p.wall}" stroke-width="2.5" opacity=".9"/>
    <path d="M-18 -46 Q-4 -54 18 -42" fill="none" stroke="${p.wallHi}" stroke-width="1" opacity=".4"/>
  </g>`;
}
