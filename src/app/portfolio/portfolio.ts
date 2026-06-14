import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css'
})
export class PortfolioComponent {
  name = 'Mr Adnan';
  role = 'Founder & CEO';

  about = `ZYPHERX is a software studio founded and led by Mr Adnan. Built on strong engineering fundamentals and a focus on clean, efficient code, the team designs and develops web applications for startups and growing businesses. ZYPHERX thrives in collaborative, team-oriented environments, pairing solid problem-solving with a fast, detail-focused approach that turns ideas into reliable products that ship.`;

  values = ['Clean Code', 'Problem Solving', 'Collaboration', 'Reliability', 'Attention to Detail', 'Fast Delivery'];

  constructor(private titleService: Title, private metaService: Meta) {
    this.titleService.setTitle('About - ZYPHERX | Software Studio');
    this.metaService.updateTag({ name: 'description', content: 'ZYPHERX is a software studio founded by Mr Adnan, building clean, efficient web applications for startups and growing businesses.' });
  }
}
