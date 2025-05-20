<?php
 
namespace App\Controller;
 
use App\Entity\Project;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
 
#[AsController]
class ProjectAddController extends AbstractController
{
    public function __invoke(Request $request, SerializerInterface $serializer, EntityManagerInterface $em): JsonResponse
    {
        // Récupération de l'utilisateur connecté
        $user = $this->getUser();
 
        // Désérialisation de la requête
        $project = $serializer->deserialize($request->getContent(), Project::class, 'json');
 
        // Ajout de l'auteur à l'article
        // $project->setAuthor($student);
 
        // Persistance du project
        $em->persist($project);
        $em->flush();
 
        // Retour de la réponse
        return new JsonResponse($project, 201);
    }
}