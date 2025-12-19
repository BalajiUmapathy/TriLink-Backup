using Microsoft.EntityFrameworkCore;
using Backend.Models.Domain;

namespace Backend.Data
{
    public class TriLinkDbContext : DbContext
    {
        public TriLinkDbContext(DbContextOptions<TriLinkDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Negotiation> Negotiations { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<LogisticsEntry> LogisticsEntries { get; set; }
        public DbSet<BuyerLogisticsJob> BuyerLogisticsJobs { get; set; }
        public DbSet<BuyerLogisticsJobQuote> BuyerLogisticsJobQuotes { get; set; }
        public DbSet<JobHistory> JobHistories { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Product -> Supplier
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Supplier)
                .WithMany()
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BuyerLogisticsJob -> Quotes
            modelBuilder.Entity<BuyerLogisticsJob>()
                .HasMany(j => j.Quotes)
                .WithOne(q => q.Job)
                .HasForeignKey(q => q.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BuyerLogisticsJobQuote>()
                .HasOne(q => q.LogisticsProvider)
                .WithMany()
                .HasForeignKey(q => q.LogisticsProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Negotiation -> Buyer & Seller
            modelBuilder.Entity<Negotiation>()
                .HasOne(n => n.Buyer)
                .WithMany()
                .HasForeignKey(n => n.BuyerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade

            modelBuilder.Entity<Negotiation>()
                .HasOne(n => n.Seller)
                .WithMany()
                .HasForeignKey(n => n.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Order -> Buyer & Seller
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Buyer)
                .WithMany()
                .HasForeignKey(o => o.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Seller)
                .WithMany()
                .HasForeignKey(o => o.SellerId)
                .OnDelete(DeleteBehavior.Restrict);
                
             // Configure LogisticsEntry -> Provider
            modelBuilder.Entity<LogisticsEntry>()
                .HasOne(l => l.Provider)
                .WithMany()
                .HasForeignKey(l => l.ProviderId)
                .OnDelete(DeleteBehavior.SetNull);

            // Fix Multiple Cascade Paths (Cycles)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Product)
                .WithMany()
                .HasForeignKey(o => o.ProductId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent Cascade Delete from Product to Order

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Negotiation)
                .WithMany()
                .HasForeignKey(o => o.NegotiationId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent Cascade from Negotiation to Order (optional but safer)

            // Fix Decimal Precision
            modelBuilder.Entity<Product>().Property(p => p.BasePrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Negotiation>().Property(n => n.CurrentOfferAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Offer>().Property(o => o.Amount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Order>().Property(o => o.FinalPrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<LogisticsEntry>().Property(l => l.ProposedCost).HasColumnType("decimal(18,2)");
            
            // Configure BuyerLogisticsJob
            modelBuilder.Entity<BuyerLogisticsJob>()
                .HasOne(b => b.Buyer)
                .WithMany()
                .HasForeignKey(b => b.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<BuyerLogisticsJob>().Property(b => b.TotalWeight).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<BuyerLogisticsJob>().Property(b => b.Length).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<BuyerLogisticsJob>().Property(b => b.Width).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<BuyerLogisticsJob>().Property(b => b.Height).HasColumnType("decimal(18,2)");
            
            // Configure Invoice relationships
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Order)
                .WithMany()
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Supplier)
                .WithMany()
                .HasForeignKey(i => i.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Buyer)
                .WithMany()
                .HasForeignKey(i => i.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Configure Invoice decimal precision
            modelBuilder.Entity<Invoice>().Property(i => i.SubTotal).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Invoice>().Property(i => i.TaxRate).HasColumnType("decimal(5,2)");
            modelBuilder.Entity<Invoice>().Property(i => i.TaxAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Invoice>().Property(i => i.TotalAmount).HasColumnType("decimal(18,2)");
            
            // Configure JobHistory relationships
            modelBuilder.Entity<JobHistory>()
                .HasOne(jh => jh.Job)
                .WithMany()
                .HasForeignKey(jh => jh.JobId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<JobHistory>()
                .HasIndex(jh => jh.LogisticsProviderId);
        }
    }
}
